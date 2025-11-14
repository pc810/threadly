package downloader

import (
	"net/url"
	"strconv"
	"strings"

	"github.com/gocolly/colly"
	"github.com/pc810/threadly/threadly-go/logger"
	"go.uber.org/zap"
)

type HTMLImage struct {
	Name   string
	Src    string
	Width  int
	Height int
}

type SEO struct {
	Title       string
	Description string
	Images      []HTMLImage
}

type Website struct {
	Scheme string
	Host   string
	Path   string
	Url    string
	SEO    SEO
}

func (website *Website) addImage(name string, url string, width int, height int) {
	website.SEO.Images = append(website.SEO.Images, HTMLImage{
		Name:   name,
		Src:    url,
		Width:  width,
		Height: height,
	})
}

func parseUrl(rawUrl string) (*Website, error) {
	url, err := url.Parse(rawUrl)

	if err != nil {
		return nil, err
	}

	return &Website{
		Scheme: url.Scheme, Host: url.Host, Path: url.Path, Url: url.String(),
	}, nil
}

func (website *Website) safeParseUrl(rawUrl string) (string, error) {

	url, err := url.Parse(rawUrl)

	if err != nil {
		return "", err
	}

	if !url.IsAbs() {
		base := website.Scheme + "://" + website.Host
		path := url.Path
		if !strings.HasPrefix(path, "/") {
			path = "/" + path
		}
		return base + path, nil
	}

	return url.String(), nil
}

func parseDimensions(h *colly.HTMLElement) (int, int) {
	widthStr := h.Attr("width")
	heightStr := h.Attr("height")

	width, err := strconv.Atoi(widthStr)
	if err != nil {
		width = 0
	}

	height, err := strconv.Atoi(heightStr)
	if err != nil {
		height = 0
	}

	return width, height
}

func OgImageHandler(website *Website) colly.HTMLCallback {
	return func(h *colly.HTMLElement) {
		content := h.Attr("content")
		url, err := website.safeParseUrl(content)
		if err != nil {
			logger.Log.Error("parse", zap.Error(err))
			return
		}
		website.addImage(h.Name, url, 0, 0)
	}
}

func HTMLImageHandler(website *Website) colly.HTMLCallback {
	return func(h *colly.HTMLElement) {
		content := h.Attr("src")
		width, height := parseDimensions(h)

		url, err := website.safeParseUrl(content)

		website.addImage(h.Name, url, width, height)

		if err != nil {
			logger.Log.Error("parse", zap.Error(err))
			return
		}

	}
}

func HTMLTitleHandler(website *Website) colly.HTMLCallback {
	return func(h *colly.HTMLElement) {

		if h.Name == "title" && h.Text != "" {
			website.SEO.Title = h.Text
		} else if h.Name == "meta" {
			website.SEO.Title = h.Attr("content")
		}

	}
}

func HTMLDescriptionHandler(website *Website) colly.HTMLCallback {
	return func(h *colly.HTMLElement) {
		if website.SEO.Description == "" {
			website.SEO.Description = h.Attr("content")
		}

	}
}

var titleTags = []string{"meta[property='og:title']", "meta[property='twitter:title']"}
var descriptionTags = []string{"meta[name='description']", "meta[property='og:description']", "meta[property='twitter:description']"}
var metaImages = []string{"meta[property='og:image']", "meta[name='twitter:image']", "link[rel='image_src']"}
var htmlImage = []string{"img[src]"}

type CollyService struct {
	c *colly.Collector
}

func NewCollyService() CollyService {

	c := colly.NewCollector(
		colly.AllowURLRevisit(),
		colly.Async(true),
		colly.MaxDepth(1),
		colly.DetectCharset(),
	)
	c.DisableCookies()

	// c.Limit(&colly.LimitRule{
	// 	DomainGlob:  "*",
	// 	Parallelism: 50,                     // Number of concurrent requests per domain
	// 	RandomDelay: 100 * time.Millisecond, // Optional: jitter to avoid rate-limits
	// })

	c.OnResponse(func(r *colly.Response) {
		contentType := r.Headers.Get("Content-Type")
		if !strings.Contains(contentType, "text/html") {
			r.Request.Abort()
			return
		}
	})

	return CollyService{
		c: c,
	}
}

func (service *CollyService) ExtractSEO(url string) (*Website, error) {

	website, err := parseUrl(url)

	if err != nil {
		logger.Log.Error("parse:url",
			zap.String("url", url),
			zap.Error(err),
		)
	}

	for _, t := range titleTags {
		service.c.OnHTML(t, HTMLTitleHandler(website))
	}
	for _, t := range descriptionTags {
		service.c.OnHTML(t, HTMLDescriptionHandler(website))
	}
	for _, t := range metaImages {
		service.c.OnHTML(t, OgImageHandler(website))
	}
	for _, t := range htmlImage {
		service.c.OnHTML(t, HTMLImageHandler(website))
	}

	// logger.Log.Info("visit", zap.Any("url", website.Url))
	// time.Sleep(500 * time.Millisecond)
	service.c.Visit(website.Url)

	service.c.Wait()
	// logger.Log.Info("finish", zap.Any("website", website))

	return website, nil
}

func (service *CollyService) Wait() {
	service.c.Wait()
}

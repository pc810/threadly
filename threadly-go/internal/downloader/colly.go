package downloader

import (
	"bytes"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	_ "golang.org/x/image/webp"

	"github.com/gocolly/colly"
	"github.com/google/uuid"
	"github.com/pc810/threadly/threadly-go/internal/logger"
	"github.com/pc810/threadly/threadly-go/internal/storage"
	"go.uber.org/zap"
)

type ImageDimension struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

func (d *ImageDimension) Ratio() float64 {

	if d.Height == 0 {
		return float64(0)
	}

	return float64(d.Width) / float64(d.Height)
}

type ImageResult struct {
	ContentType string          `json:"contentType"`
	URL         string          `json:"url"`
	Filename    string          `json:"filename"`
	Size        int             `json:"size"`
	Dimension   *ImageDimension `json:"dimension"`
	Err         error           `json:"error"`
}

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
	c             *colly.Collector
	onImageResult func(result ImageResult)
}

func NewHTMLCollyService() CollyService {

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

func NewImageCollyService(prefix string, storageService storage.StorageService, onResult func(ImageResult)) CollyService {
	c := colly.NewCollector(
		colly.Async(true),
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"),
	)
	c.DisableCookies()
	c.WithTransport(&http.Transport{
		DisableCompression: false, // ENABLE decompression
	})
	c.OnResponse(func(r *colly.Response) {
		contentType := r.Headers.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			r.Request.Abort()
			return
		}
		filePath := filepath.Join(os.TempDir(), "threadly-temp")
		os.MkdirAll(filePath, os.ModePerm)

		ext := ""
		switch contentType {
		case "image/jpeg":
			ext = ".jpg"
		case "image/png":
			ext = ".png"
		case "image/webp":
			ext = ".webp"
		default:
			ext = ".jpg"
		}

		filename := fmt.Sprintf("image_%s_%d_%s%s", prefix, time.Now().UnixNano(), uuid.New().String(), ext)

		size := len(r.Body)

		if err := storageService.Save(filename, r.Body, contentType); err != nil {
			fmt.Println("Failed to save image:", err)
		}

		if onResult != nil {
			onResult(ImageResult{
				URL:         r.Request.URL.String(),
				Filename:    filename,
				Size:        size,
				Err:         nil,
				Dimension:   GetImageDimensions(r.Body),
				ContentType: contentType,
			})
		}
	})

	return CollyService{
		c:             c,
		onImageResult: onResult,
	}
}

func (service *CollyService) ExtractSEO(url string) (*Website, error) {

	website, err := parseUrl(url)
	website.SEO.Images = make([]HTMLImage, 0)
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

	service.c.Visit(website.Url)

	service.c.Wait()

	return website, nil
}

func (service *CollyService) ExtractImage(url string) error {

	website, err := parseUrl(url)

	if err != nil {
		logger.Log.Error("parse:url",
			zap.String("url", url),
			zap.Error(err),
		)
		return err
	}

	service.c.Visit(website.Url)

	return nil
}

func GetImageDimensions(data []byte) *ImageDimension {
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return &ImageDimension{Width: 0, Height: 0}
	}
	bounds := img.Bounds()
	return &ImageDimension{Width: bounds.Dx(), Height: bounds.Dy()}
}

func (service *CollyService) Wait() {
	service.c.Wait()
}

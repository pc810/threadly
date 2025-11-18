.PHONY: image seo web dev

image:
	cd threadly-go/cmd/image-worker && go run .

seo:
	cd threadly-go/cmd/seo-worker && go run .

web:
	cd web && npm run dev

dev:
	make -j3 image seo web

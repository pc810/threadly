package storage

import (
	"os"
	"path/filepath"
)

type localStorageService struct {
	outDir string
}

func NewLocalStorageService(outDir string) *localStorageService {
	return &localStorageService{
		outDir,
	}
}

func (s *localStorageService) Save(filename string, data []byte, _ string) error {
	filePath := filepath.Join(s.outDir, filename)
	return os.WriteFile(filePath, data, 0644)
}

func (s *localStorageService) Delete(filename string) error {
	filePath := filepath.Join(s.outDir, filename)
	return os.Remove(filePath)
}

func (s *localStorageService) Get(filename string) ([]byte, error) {
	filePath := filepath.Join(s.outDir, filename)
	return os.ReadFile(filePath)
}

func (s *localStorageService) GetProvider() string {
	return "local"
}

func (s *localStorageService) GetBasePath() string {
	return s.outDir
}

package com.threadly.media.application.usecase;

import com.threadly.media.ImageMedia;
import com.threadly.media.domain.Media;
import java.util.Optional;

public interface IStorage {

  ImageMedia getImage(Media media);
}

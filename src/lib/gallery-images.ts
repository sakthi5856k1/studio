
export type GalleryImage = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type GalleryData = {
  galleryImages: GalleryImage[];
};

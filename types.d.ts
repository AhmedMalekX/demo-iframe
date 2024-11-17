export type IGeneratingImagesMethods =
  | "From text"
  | "From image"
  | "From elements";

export type IImage = {
  imgFileUrl: string;
  imgUrl: string;
  uiid: string;
};

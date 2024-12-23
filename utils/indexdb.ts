import { openDB } from "idb";

const DB_NAME = "iframeData";
const STORE_NAME = "generationMethodsData";
const STORE_VERSION = 1;

const dbPromise = openDB(DB_NAME, STORE_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

type TabName = "from text" | "from image" | "from elements";

type Images = { imgUrl: string; uuid: string; imageFileUrl: string }[];

type DataForFromTextTab = {
  images: Images;
  zoomLevel: number;
  isDownloading: boolean;
  selectedImagePreview: string;
};

type DataForFromImageTab = {
  images: Images;
  zoomLevel: number;
  isDownloading: boolean;
  selectedImagePreview: string;
};

type DataForFromElementsTab = {
  editorState: any;
  zoomLevel: number;
  isDownloading: boolean;
  selectedImagePreview: string;
};

type DataForTab<T extends TabName> = T extends "from text"
  ? DataForFromTextTab
  : T extends "from image"
    ? DataForFromImageTab
    : T extends "from elements"
      ? DataForFromElementsTab
      : never;

export const saveData = async <T extends TabName>(
  tabName: T,
  data: DataForTab<T>,
) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, data, tabName);
};

export const loadData = async (tabName: TabName) => {
  const db = await dbPromise;
  return db.get(STORE_NAME, tabName);
};

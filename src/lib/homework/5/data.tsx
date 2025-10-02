import type { ReactNode } from "react";

export interface HomeworkCard {
  title: string;
  contentBasic: ReactNode;
  contentAdvanced: ReactNode;
}

export const HWData: HomeworkCard = {
  title: "Image Zoom In/Out",
  contentBasic: (
    <>
      <ul>
        <li>process uploaded image and draw on canvas</li>
        <li>scrolling to zoom in/out the image</li>
      </ul>
    </>
  ),
  contentAdvanced: (
    <>
      <ul>
        <li>mouse position as center point to zoom in/out the image</li>
        <li>drag to move the image</li>
        <li>mobile (add)</li>
      </ul>
    </>
  ),
};

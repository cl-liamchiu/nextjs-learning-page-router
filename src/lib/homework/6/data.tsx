import type { ReactNode } from "react";

export interface HomeworkCard {
  title: string;
  contentBasic: ReactNode;
  contentAdvanced: ReactNode;
}

export const HWData: HomeworkCard = {
  title: "Merge 01 ~ 05",
  contentBasic: (
    <>
      <ul>
        <li>merge homework 01 ~ 05 and implement via NextJS</li>
        <li>every homeworks have their own pages (each has a unique url)</li>
      </ul>
    </>
  ),
  contentAdvanced: <></>,
};

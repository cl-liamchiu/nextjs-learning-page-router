import type { ReactNode } from "react";

export interface HomeworkCard {
  title: string;
  contentBasic: ReactNode;
  contentAdvanced: ReactNode;
}

export const HWData: HomeworkCard = {
  title: "Component Add/Remove",
  contentBasic: (
    <>
      <ul>
        <li>2 buttons: </li>
        <ul>
          <li>add new component to the bottom</li>
          <li>remove last component</li>
        </ul>
      </ul>
    </>
  ),
  contentAdvanced: (
    <>
      <ul>
        <li>drag-and-drop to change order of 2 components</li>
        <li>remove any component</li>
      </ul>
    </>
  ),
};

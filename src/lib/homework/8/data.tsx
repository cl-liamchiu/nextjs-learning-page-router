import type { ReactNode } from "react";

export interface HomeworkCard {
  title: string;
  contentBasic: ReactNode;
  contentAdvanced: ReactNode;
}

export const HWData: HomeworkCard = {
  title: "Todo Lists",
  contentBasic: (
    <>
      <ul>
        <li>2 pages:</li>
        <ul>
          <li>
            /products: to browse products information (name / thumbnail / price
            / etc.), and a button to add products into shopping cart
          </li>
          <li>
            /shopping-cart: list products which have been added into shopping
            cart
          </li>
        </ul>
      </ul>
      <p>
        Note: please store shopping cart products in redux states to achieve
        cross-page states sharing.
      </p>
    </>
  ),
  contentAdvanced: (
    <>
      <ul>
        <li>decorates UI with Scss/Sass</li>
      </ul>
    </>
  ),
};

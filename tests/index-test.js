import expect from "expect";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import Drawer from "src/";

describe("Drawer", () => {
  let node;

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it("renders children when open", () => {
    node = document.body.appendChild(node);

    render(
      <Drawer parentElement={node} open={true} onRequestClose={() => {}}>
        I'm a drawer
      </Drawer>,
      node,
      () => {
        expect(node.innerHTML).toContain("I'm a drawer");
      }
    );
  });
});

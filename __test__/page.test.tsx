import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

test("Page", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { level: 4, name: "Task Management made easy!" })
  ).toBeDefined();
});

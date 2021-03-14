import BioEditor from "./bioeditor.js";
import { render, fireEvent } from "@testing-library/react";
//import axios from "axios";

jest.mock("./axios");

test("When no bio is passed to it, an add button is rendered else edit", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").innerHTML).toContain(
        "add" || "edit"
    );
});

test("Clicking either the add or edit button causes a textarea and a SAVE button to be rendered.", () => {
    const { container } = render(<BioEditor />);

    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector("textarea")).toBeTruthy();
});

//jest.mock("./axios");
//test("Clicking the SAVE button causes an ajax request", () => {
// const onclick = jest.fn();

// axios.post({
//  data: {
//  btnTxt: "",
//  },
//  });

// const { container } = render(<BioEditor updateBio={onclick} />);

//  fireEvent.click(container.querySelector(""));
//    expect(mockCallBack.mock.calls.length).toEqual(1);
//});

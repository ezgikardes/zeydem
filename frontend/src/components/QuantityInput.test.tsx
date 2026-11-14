import { fireEvent, render, screen } from "@testing-library/react";
import QuantityInput from "./QuantityInput";

describe("QuantityInput", () => {
  it("cannot go below 1", () => {
    render(
      <QuantityInput
        value={1}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Azalt" })).toBeDisabled();
  });

  it("cannot go above 10", () => {
    render(
      <QuantityInput
        value={10}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Artır" })).toBeDisabled();
  });

  it("shows the value and sends value + 1 or value − 1 when a button is pressed", () => {
    const onChange = jest.fn();
    render(
      <QuantityInput
        value={3}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("group", { name: "Adet" })).toHaveTextContent("3");

    fireEvent.click(screen.getByRole("button", { name: "Artır" }));
    expect(onChange).toHaveBeenLastCalledWith(4);

    fireEvent.click(screen.getByRole("button", { name: "Azalt" }));
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("takes its group name from label when one is given", () => {
    render(
      <QuantityInput
        value={2}
        onChange={jest.fn()}
        label="Çiğ Badem 500 g adedi"
      />,
    );

    expect(
      screen.getByRole("group", { name: "Çiğ Badem 500 g adedi" }),
    ).toHaveTextContent("2");
  });
});

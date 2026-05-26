export const kelvinToRgb = (kelvin) => {
  const temperature = Math.max(2200, Math.min(6500, kelvin)) / 100;
  const red = temperature <= 66 ? 255 : 329.698727446 * ((temperature - 60) ** -0.1332047592);
  const green = temperature <= 66
    ? 99.4708025861 * Math.log(temperature) - 161.1195681661
    : 288.1221695283 * ((temperature - 60) ** -0.0755148492);
  const blue = temperature >= 66 ? 255 : temperature <= 19 ? 0 : 138.5177312231 * Math.log(temperature - 10) - 305.044792731;
  const channel = (value) => Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, '0');
  return `#${channel(red)}${channel(green)}${channel(blue)}`;
};


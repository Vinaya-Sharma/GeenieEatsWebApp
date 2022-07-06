module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      borderRadus: {
        alot: "2000px",
      },
      width: {
        200: "200px",
        250: "250px",
        "11/12screen": "80vw",
        "100per": "100%",
        "6/10screen": "60vw",
      },
      minWidth: {
        320: "320px",
        250: "250px",
        200: "200px",
        100: "100px",
        150: "150px",
      },
      maxWidth: {
        320: "320px",
        250: "250px",
        100: "100px",
      },
      minHeight: {
        100: "100px",
      },
      maxHeight: {
        320: "320px",
        250: "250px",
        100: "100px",
      },
      colors: {
        lblue: "#252836",
        teal: "#50D1AA",
        lgreen: "#d0e0cc",
        dblue: "#1F1D2B",
        base: "#252836",
        dteal: "#03875F",
      },
    },
    fontFamily: {
      playfair: "Playfair Display",
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

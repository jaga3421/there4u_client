import { styled } from "@mui/system";

const Dot = styled("span")({
  opacity: 0,
  animation: "fade-in-out 1.5s infinite",
  "&:nth-of-type(1)": {
    animationDelay: "0s",
  },
  "&:nth-of-type(2)": {
    animationDelay: "0.5s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "1s",
  },
  "@keyframes fade-in-out": {
    "0%": { opacity: 0 },
    "33%": { opacity: 1 },
    "66%": { opacity: 1 },
    "100%": { opacity: 0 },
  },
});

const LoadingDots = () => {
  return (
    <span>
      <Dot>.</Dot>
      <Dot>.</Dot>
      <Dot>.</Dot>
    </span>
  );
};

export default LoadingDots;

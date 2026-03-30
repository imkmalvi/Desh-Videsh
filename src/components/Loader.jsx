import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <div className="loader-wrapper">
      <CircularProgress size={36} />
    </div>
  );
}

export default Loader;
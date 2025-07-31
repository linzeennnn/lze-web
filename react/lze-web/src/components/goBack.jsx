export default function GoBack() {
  return (
    <button
      id="go-back"
      className="btn"
      onClick={() => {
        const referrer = document.referrer;
        const currentHost = window.location.host;
        if (referrer && new URL(referrer).host === currentHost) {
          window.history.back();
        } else {
          window.location.href =  window.location.origin;
        }
      }}
    >
    </button>
  );
}

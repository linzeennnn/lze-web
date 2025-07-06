import useGlobal from './global';

export default function ShowPath() {
  const nowPath = useGlobal((state) => state.nowPath);

  return (
    <div id="show-path" title={nowPath}>
      <span>{nowPath}</span>
    </div>
  );
}

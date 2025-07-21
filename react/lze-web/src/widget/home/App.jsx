import { useGlobal } from "./global";
import MainPage from "./mainPage/mainPage";
import LockPage from "./lockPage.jsx/lockPage";
export default function App() {
    const locked = useGlobal(state => state.locked);
    return (
        <>
        <LockPage />
        <MainPage />
        </>
    )
}

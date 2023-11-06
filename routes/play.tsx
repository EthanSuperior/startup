import Log from "../islands/Log.tsx";
import OtrioGame from "../islands/Otrio.tsx";
import PlaySettings from "../islands/Settings.tsx";
export default function PlayOtrio() {
    return (
        <>
        <main class="container mx-auto">
            <div class="grid grid-cols-8 gap-4">
                <div class="col-span-6">
                    <div class="players text-center">
                        <span class="user-name">Somebody</span>
                        <OtrioGame/>
                    </div>
                </div>
                <div class="col-span-2">
                    <Log/>
                </div>
            </div>
        </main>
        <PlaySettings/>
        </>
    );
}
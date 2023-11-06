export default function Log() {
    return (
        <>
            <button class="btn btn-link text-decoration-none border-0 p-0" data-toggle="collapse" data-target="#log">Toggle Log</button>
            <div id="log" class="notification collapse">
                <ul id = 'log_msg'>
                </ul>
            </div>
        </>
    );
}
import "./Education.css";

export default function Education({ elapsedSeconds = null }) {
    return (
        <div className = "container mt-5">
            <h1 className = "mb-3">Education | 2022 - 2026</h1>
            {elapsedSeconds !== null && (
                <div className = "elapsed mb-3 text-muted small">Time on About before navigating here: {elapsedSeconds} second{elapsedSeconds !== 1 ? 's' : ''}</div>
            )}
            <p className = "mb-2">Software Engineering</p>
            <p className = "mb-0">HUFLIT - Ho Chi Minh City University of Foreign Languages and Information Technology</p>
        </div>
    );
}
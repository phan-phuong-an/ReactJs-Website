import "./Education.css";

export default function Education({ elapsedSeconds = null }) {
    return (
        <div className="education-container">
            <h1>Education | 2022 - 2026</h1>
            {elapsedSeconds !== null && (
                <div className="elapsed">Time on About before navigating here: {elapsedSeconds} second{elapsedSeconds !== 1 ? 's' : ''}</div>
            )}
            <p>Software Engineering</p>
            <p>HUFLIT - Ho Chi Minh City University of Foreign Languages and Information Technology</p>
        </div>
    );
}
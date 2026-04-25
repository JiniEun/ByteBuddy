import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./styles.css";
import penguinImg from "./assets/penguin.png";

function App() {
	const [repoPath, setRepoPath] = useState("");
	const [notes, setNotes] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedNote, setSelectedNote] = useState(null);
	const [error, setError] = useState("");
	const [clicked, setClicked] = useState(false);
	const [quizMode, setQuizMode] = useState(false);
	const [showAnswer, setShowAnswer] = useState(false);
	const [showRepoPath, setShowRepoPath] = useState(false);

	const handlePenguinClick = () => {
		setClicked(true);
		handleOpenDetail();

		setTimeout(() => setClicked(false), 200);
	};

	const currentNote = useMemo(() => {
		if (!notes.length) return null;
		return notes[currentIndex % notes.length];
	}, [notes, currentIndex]);

	useEffect(() => {
		setShowAnswer(false);
	}, [currentIndex, currentNote]);

	useEffect(() => {
		const loadDefaultSample = async () => {
			// 필요하면 기본 repo 경로를 preload/ipc로 확장할 수 있음.
			// 지금은 사용자가 직접 선택하는 흐름에 집중.
		};

		loadDefaultSample();
	}, []);

	useEffect(() => {
		if (!notes.length) return;

		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % notes.length);
		}, 7000);

		return () => clearInterval(timer);
	}, [notes]);

	const handleSelectRepo = async () => {
		setError("");

		const selectedPath = await window.electronAPI.selectRepo();
		if (!selectedPath) return;

		setRepoPath(selectedPath);
		setShowRepoPath(true);

		const result = await window.electronAPI.loadNotes(selectedPath);

		if (!result.success) {
			setError(result.error || "노트를 불러오지 못했습니다.");
			return;
		}

		setNotes(result.notes || []);
		setCurrentIndex(0);
		setSelectedNote(null);

		if (!result.notes?.length) {
			setError("Markdown 파일(.md)을 찾지 못했습니다.");
		}

		// 👇 3초 후 자동 숨김
		setTimeout(() => {
			setShowRepoPath(false);
		}, 3000);
	};

	const handleOpenDetail = () => {
		if (!currentNote) return;
		setSelectedNote(currentNote);
	};

	const handleRevealAnswer = () => {
		setShowAnswer(true);
	};

	const handleToggleQuizMode = () => {
		setQuizMode((prev) => !prev);
		setShowAnswer(false);
	};

	const handleCloseDetail = () => {
		setSelectedNote(null);
	};

	const handleWindowClose = () => {
		window.electronAPI.closeWindow();
	};

	const handleWindowMinimize = () => {
		window.electronAPI.minimizeWindow();
	};

	return (
		<div className="app-shell">
			<div className="pet-shell">
				<div className="drag-header">
					<div className="traffic-lights no-drag">
						<button
								type="button"
								className="light red"
								onClick={handleWindowClose}
								aria-label="앱 닫기"
								title="닫기"
						/>
						<button
								type="button"
								className="light yellow"
								onClick={handleWindowMinimize}
								aria-label="최소화"
								title="최소화"
						/>
						<span className="light green" title="coming soon"/>
					</div>

					<div className="header-actions no-drag">
						<button
								type="button"
								className="header-btn subtle"
								onClick={handleToggleQuizMode}
						>
							{quizMode ? "퀴즈 ON" : "일반"}
						</button>

						<button
								type="button"
								className="header-btn"
								onClick={handleSelectRepo}
						>
							Repo
						</button>
					</div>
				</div>

				{showRepoPath && (
						<div className="repo-label no-drag">
							{repoPath}
						</div>
				)}

				{error ? (
						<div className="bubble error-bubble no-drag">
							<strong>앗!</strong>
							<div>{error}</div>
						</div>
				) : currentNote ? (
						<div className="bubble no-drag">
							<div className="bubble-title">{currentNote.title}</div>

							{currentNote.question ? (
									<div className="qa-block">
										<div className="qa-label">Q</div>
										<div className="qa-text">{currentNote.question}</div>
									</div>
							) : (
									<div className="bubble-content">
										질문이 없어요. 노트 형식을 확인해줘!
									</div>
							)}

							{quizMode ? (
									showAnswer ? (
											<div className="qa-block answer">
											<div className="qa-label">A</div>
												<div className="qa-text">
													{currentNote.answer || currentNote.summary || '답변이 아직 없어요.'}
												</div>
											</div>
									) : (
											<div className="quiz-actions">
												<button className="reveal-btn" onClick={handleRevealAnswer}>
													답 보기
												</button>
											</div>
									)
							) : (
									<div className="qa-block answer">
										<div className="qa-label">A</div>
										<div className="qa-text">
											{currentNote.shortAnswer || '답변 준비 중...'}
										</div>
									</div>
							)}

							<div className="bubble-actions">
								<button className="text-btn" onClick={handleOpenDetail}>
									자세히 보기
								</button>
							</div>
						</div>
				) : (
						<div className="bubble no-drag">
							<div className="bubble-title">ByteBuddy</div>
							<div className="bubble-content">
								CS 지식 repo를 연결하면 펭귄이 설명해줄게!
							</div>
						</div>
				)}

				<div className="penguin-wrap no-drag">
					<img
							src={penguinImg}
							alt="penguin"
							className={`penguin-img ${clicked ? "bounce" : ""}`}
							onClick={handlePenguinClick}
					/>
				</div>
			</div>

			{selectedNote && (
					<div className="detail-panel no-drag">
						<div className="detail-header">
							<div className="detail-title">{selectedNote.title}</div>
							<button className="close-btn" onClick={handleCloseDetail}>
								닫기
							</button>
						</div>

						<div className="detail-body markdown-body">
							{(selectedNote.question || selectedNote.answer || selectedNote.summary) && (
									<div className="detail-qa-card">
										{selectedNote.question && (
												<div className="qa-block">
													<div className="qa-label">Q</div>
													<div className="qa-text">{selectedNote.question}</div>
												</div>
										)}

										{(selectedNote.answer || selectedNote.summary) && (
												<div className="qa-block answer">
													<div className="qa-label">A</div>
													<div className="qa-text">
														{selectedNote.answer || selectedNote.summary}
													</div>
												</div>
										)}
									</div>
							)}

							<ReactMarkdown>{selectedNote.content}</ReactMarkdown>
						</div>
					</div>
			)}
		</div>
	);
}

export default App;

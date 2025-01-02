import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import styles from "./GoalTracker.module.css";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function GoalTracker({ month, year, goals = [], onGoalsUpdate }) {
  const navigate = useNavigate();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState("");
  const [currentReflection, setCurrentReflection] = useState({
    growth: "",
    memorable: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [completedGoalIndex, setCompletedGoalIndex] = useState(null);

  const getEncouragingMessage = (goal) => {
    return `Share your amazing journey with "${goal.text}" 🌟 – Your reflections are inspiring!`;
  };

  const createConfetti = () => {
    const confettiCount = 100;
    const container = document.body;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = styles.confetti;

      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDelay = Math.random() * 3 + "s";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 50%)`;

      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  const handleAddGoal = () => {
    if (currentGoal.trim()) {
      let updatedGoals;

      if (editingIndex !== null) {
        updatedGoals = goals.map((goal, index) =>
          index === editingIndex ? { ...goal, text: currentGoal } : goal
        );
      } else {
        const newGoal = {
          id: Date.now().toString(),
          text: currentGoal,
          completed: false,
          reflection: null,
          createdAt: new Date().toISOString(),
        };
        updatedGoals = [...goals, newGoal];
      }

      onGoalsUpdate(updatedGoals);
      setCurrentGoal("");
      setIsGoalModalOpen(false);
      setEditingIndex(null);
    }
  };

  const handleEdit = (index) => {
    setCurrentGoal(goals[index].text);
    setEditingIndex(index);
    setIsGoalModalOpen(true);
  };

  const handleToggleComplete = (index) => {
    const goal = goals[index];
    if (!goal.completed) {
      createConfetti();
      setCompletedGoalIndex(index);
      setIsReflectionModalOpen(true);
    } else {
      const updatedGoals = goals.map((g, i) =>
        i === index ? { ...g, completed: false, reflection: null } : g
      );
      onGoalsUpdate(updatedGoals);
    }
  };

  const handleSaveReflection = () => {
    const updatedGoals = goals.map((goal, index) =>
      index === completedGoalIndex
        ? {
            ...goal,
            completed: true,
            completedAt: new Date().toISOString(),
            reflection: {
              growth: currentReflection.growth.trim(),
              memorable: currentReflection.memorable.trim(),
            },
          }
        : goal
    );

    onGoalsUpdate(updatedGoals);
    setCurrentReflection({ growth: "", memorable: "" });
    setIsReflectionModalOpen(false);
    setCompletedGoalIndex(null);
  };

  const navigateToNotes = () => {
    navigate("/notes");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{month}</h2>
      </div>

      <div className={styles.content}>
        {goals.length === 0 && (
          <div className={styles.emptyState}>No goals added yet</div>
        )}

        {goals.map((goal, index) => (
          <div key={goal.id || index} className={styles.goalItem}>
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => handleToggleComplete(index)}
              className={styles.checkbox}
            />
            <span
              className={`${styles.goalText} ${
                goal.completed ? styles.completed : ""
              }`}
            >
              Goal Nº {index + 1}: {goal.text}
            </span>
            {!goal.completed && (
              <button
                onClick={() => handleEdit(index)}
                className={styles.editButton}
              >
                <Pencil size={16} />
              </button>
            )}
            {goal.completed && !goal.reflection && (
              <div className={styles.encouragement}>
                {getEncouragingMessage(goal)}
              </div>
            )}
          </div>
        ))}

        {goals.length < 25 && (
          <button
            onClick={() => {
              setCurrentGoal("");
              setEditingIndex(null);
              setIsGoalModalOpen(true);
            }}
            className={styles.addButton}
          >
            <Plus size={16} />
            add goal Nº {goals.length + 1}
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <div>Total # of goals: {goals.length}</div>
        <div>
          Number of goals Achieved: {goals.filter((g) => g.completed).length}
        </div>
        <button onClick={navigateToNotes} className={styles.notesButton}>
          Check {month} Notes
        </button>
      </div>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editingIndex !== null ? "Edit Goal" : "Add New Goal"}</h3>
            <input
              type="text"
              placeholder="Enter your goal"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              className={styles.input}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleAddGoal} className={styles.submitButton}>
                {editingIndex !== null ? "Save Changes" : "Add Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reflection Modal */}
      {isReflectionModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>🥳 YES! You DID it!</h3>
            <div className={styles.reflectionForm}>
              <div className={styles.formGroup}>
                <label>
                  Every accomplishment adds to your journey - How has achieving
                  this goal helped you grow 🤩?
                </label>
                <textarea
                  value={currentReflection.growth}
                  onChange={(e) =>
                    setCurrentReflection({
                      ...currentReflection,
                      growth: e.target.value,
                    })
                  }
                  className={styles.textarea}
                  placeholder="Document your growth..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  Every achievement has a special moment 🌟 - what was yours
                  while working towards this goal?
                </label>
                <textarea
                  value={currentReflection.memorable}
                  onChange={(e) =>
                    setCurrentReflection({
                      ...currentReflection,
                      memorable: e.target.value,
                    })
                  }
                  className={styles.textarea}
                  placeholder="Capture your unforgettable moment..."
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => {
                    setIsReflectionModalOpen(false);
                    setCompletedGoalIndex(null);
                    setCurrentReflection({ growth: "", memorable: "" });
                  }}
                  className={styles.cancelButton}
                >
                  Come Back Later
                </button>
                <button
                  onClick={handleSaveReflection}
                  className={styles.submitButton}
                  disabled={
                    !currentReflection.growth.trim() ||
                    !currentReflection.memorable.trim()
                  }
                >
                  Save Reflection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalTracker;

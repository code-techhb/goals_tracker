import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import styles from "./GoalTracker.module.css";

function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState("");
  const [currentReflection, setCurrentReflection] = useState({
    growth: "",
    memorable: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [completedGoalIndex, setCompletedGoalIndex] = useState(null);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const createConfetti = () => {
    const confettiCount = 100;
    const container = document.body;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = styles.confetti;

      // Random position, color, and animation delay
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDelay = Math.random() * 3 + "s";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 50%)`;

      container.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 2000);
    }
  };

  const handleAddGoal = () => {
    if (currentGoal.trim()) {
      if (editingIndex !== null) {
        const updatedGoals = [...goals];
        updatedGoals[editingIndex] = {
          ...goals[editingIndex],
          text: currentGoal,
        };
        setGoals(updatedGoals);
        setEditingIndex(null);
      } else {
        setGoals([
          ...goals,
          {
            text: currentGoal,
            completed: false,
            reflection: null,
          },
        ]);
      }
      setCurrentGoal("");
      setIsGoalModalOpen(false);
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
      const updatedGoals = [...goals];
      updatedGoals[index] = {
        ...updatedGoals[index],
        completed: false,
        reflection: null,
      };
      setGoals(updatedGoals);
    }
  };

  const handleSaveReflection = () => {
    const updatedGoals = [...goals];
    updatedGoals[completedGoalIndex] = {
      ...updatedGoals[completedGoalIndex],
      completed: true,
      reflection: { ...currentReflection },
    };
    setGoals(updatedGoals);
    setCurrentReflection({ growth: "", memorable: "" });
    setIsReflectionModalOpen(false);
    setCompletedGoalIndex(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{currentMonth}</h2>
      </div>

      <div className={styles.content}>
        {goals.length === 0 && (
          <div className={styles.emptyState}>No goals added yet</div>
        )}

        {goals.map((goal, index) => (
          <div key={index} className={styles.goalItem}>
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
              goal #{index + 1}: {goal.text}
            </span>
            <button
              onClick={() => handleEdit(index)}
              className={styles.editButton}
            >
              <Pencil size={16} />
            </button>
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
            add goal #{goals.length + 1}
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <div>Total # of goals: {goals.length}</div>
        <div>
          Number of goals Achieved: {goals.filter((g) => g.completed).length}
        </div>
        <button className={styles.notesButton}>
          Check {currentMonth} Notes
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
            <h3>Reflect on Your Achievement</h3>
            <div className={styles.reflectionForm}>
              <div className={styles.formGroup}>
                <label>How has achieving this goal helped you grow?</label>
                <textarea
                  value={currentReflection.growth}
                  onChange={(e) =>
                    setCurrentReflection({
                      ...currentReflection,
                      growth: e.target.value,
                    })
                  }
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  What was the most memorable moment in working towards it?
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
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => {
                    setIsReflectionModalOpen(false);
                    setCompletedGoalIndex(null);
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReflection}
                  className={styles.submitButton}
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

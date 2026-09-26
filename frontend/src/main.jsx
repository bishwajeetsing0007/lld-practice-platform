import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

/*
 * ============================================================
 * API CONFIGURATION
 * ============================================================
 *
 * Local:
 *   http://localhost:8080/api
 *
 * Render:
 *   https://lld-practice-platform-uibq.onrender.com/api
 *
 * Render environment variable:
 *   VITE_API_URL=https://lld-practice-platform-uibq.onrender.com
 */

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

const API = BASE_URL.endsWith("/api")
  ? BASE_URL
  : `${BASE_URL}/api`;


/*
 * ============================================================
 * GENERIC API REQUEST HELPER
 * ============================================================
 */

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      // Response was not JSON
    }

    throw new Error(message);
  }

  return response.json();
}


/*
 * ============================================================
 * DEFAULT DESIGN DATA
 * ============================================================
 */

const emptyDesign = {
  assumptions: "",
  classesResponsibilities: "",
  relationships: "",
  patterns: "",
  tradeoffs: "",
  diagramJson: "[]",
  challengeResponse: "",
  changeResponse: "",
};


/*
 * ============================================================
 * MAIN APP
 * ============================================================
 */

function App() {
  const [view, setView] = useState("dashboard");

  const [problems, setProblems] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const [active, setActive] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark
      ? "dark"
      : "light";
  }, [dark]);


  /*
   * ==========================================================
   * LOAD DASHBOARD DATA
   * ==========================================================
   */

  async function load() {
    try {
      const [problemData, attemptData] = await Promise.all([
        request(`${API}/problems`),
        request(`${API}/attempts`),
      ]);

      setProblems(problemData);
      setAttempts(attemptData);
    } catch (error) {
      console.error("Backend connection error:", error);

      setToast(
        `Could not connect to backend: ${error.message}`
      );
    }
  }


  /*
   * ==========================================================
   * CREATE NEW ATTEMPT
   * ==========================================================
   */

  async function start(problem) {
    try {
      const attempt = await request(
        `${API}/attempts?problemId=${problem.id}`,
        {
          method: "POST",
        }
      );

      setActive({
        attempt: {
          ...attempt,
          ...emptyDesign,
        },
        problem,
      });

      setEvaluation(null);
      setView("workspace");
    } catch (error) {
      console.error("Create attempt error:", error);

      setToast("Could not create attempt.");
    }
  }


  /*
   * ==========================================================
   * OPEN EXISTING ATTEMPT
   * ==========================================================
   */

  async function openAttempt(id) {
    try {
      const data = await request(
        `${API}/attempts/${id}`
      );

      setActive({
        attempt: {
          ...emptyDesign,
          ...data.attempt,
        },
        problem: data.attempt.problem,
      });

      setEvaluation(data.evaluation);
      setView("review");
    } catch (error) {
      console.error("Open attempt error:", error);

      setToast("Could not open attempt.");
    }
  }


  /*
   * ==========================================================
   * SAVE ATTEMPT
   * ==========================================================
   */

  async function saveAttempt(payload) {
    if (!active) {
      return;
    }

    try {
      const updatedAttempt = await request(
        `${API}/attempts/${active.attempt.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      setActive({
        ...active,
        attempt: {
          ...active.attempt,
          ...updatedAttempt,
          ...payload,
        },
      });

      return updatedAttempt;
    } catch (error) {
      console.error("Save attempt error:", error);

      setToast("Could not save attempt.");
      throw error;
    }
  }


  /*
   * ==========================================================
   * SUBMIT DESIGN
   * ==========================================================
   */

  async function submit(payload) {
    try {
      const submittedAttempt = await request(
        `${API}/attempts/${active.attempt.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await request(
        `${API}/attempts/${submittedAttempt.id}`
      );

      setActive({
        attempt: {
          ...emptyDesign,
          ...result.attempt,
        },
        problem: result.attempt.problem,
      });

      setEvaluation(result.evaluation);

      await load();

      setView("review");
    } catch (error) {
      console.error("Submit error:", error);

      setToast("Could not submit design.");
    }
  }


  /*
   * ==========================================================
   * NAVIGATION
   * ==========================================================
   */

  const nav = [
    ["dashboard", "⌂", "Overview"],
    ["problems", "◫", "Problems"],
    ["history", "◷", "My Attempts"],
    ["progress", "↗", "Progress"],
  ];


  /*
   * ==========================================================
   * APP UI
   * ==========================================================
   */

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside>
        <div className="brand">
          <b>L</b> LLDX
        </div>

        <small>
          DESIGN · PRACTICE · IMPROVE
        </small>

        {nav.map((item) => (
          <button
            className={
              view === item[0]
                ? "nav active"
                : "nav"
            }
            onClick={() => setView(item[0])}
            key={item[0]}
          >
            {item[1]} {item[2]}
          </button>
        ))}

        <div className="side-bottom">

          <button
            className="nav"
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀" : "☾"}{" "}
            {dark ? "Light" : "Dark"} mode
          </button>

          <div className="user">
            <i>B</i>

            <span>
              <b>Bishwajeet</b>
              <small>Developer</small>
            </span>
          </div>

        </div>
      </aside>


      {/* MAIN */}

      <main>

        <header>
          <span>
            LLDX / {view}
          </span>

          <div>
            Practice workspace

            <button
              onClick={() => setDark(!dark)}
            >
              ◐
            </button>

            <i>B</i>
          </div>
        </header>


        {view === "dashboard" && (
          <Dashboard
            problems={problems}
            attempts={attempts}
            start={start}
            setView={setView}
            openAttempt={openAttempt}
          />
        )}


        {view === "problems" && (
          <Problems
            problems={problems}
            attempts={attempts}
            start={start}
          />
        )}


        {view === "history" && (
          <History
            attempts={attempts}
            openAttempt={openAttempt}
          />
        )}


        {view === "progress" && (
          <Progress attempts={attempts} />
        )}


        {view === "workspace" && active && (
          <Workspace
            active={active}
            save={saveAttempt}
            submit={submit}
            back={() => setView("problems")}
          />
        )}


        {view === "review" && active && (
          <Review
            active={active}
            evaluation={evaluation}
            retry={() => start(active.problem)}
            back={() => setView("history")}
            save={saveAttempt}
          />
        )}

      </main>


      {/* TOAST */}

      {toast && (
        <div
          className="toast"
          onClick={() => setToast("")}
        >
          {toast}
        </div>
      )}

    </div>
  );
}


/*
 * ============================================================
 * DASHBOARD
 * ============================================================
 */

function Dashboard({
  problems,
  attempts,
  start,
  setView,
  openAttempt,
}) {
  const completed = attempts.filter(
    (x) => x.status === "COMPLETED"
  ).length;

  const scoredAttempts = attempts.filter(
    (x) => x.score != null
  );

  const average =
    Math.round(
      scoredAttempts.reduce(
        (sum, x) => sum + x.score,
        0
      ) /
      (scoredAttempts.length || 1)
    );

  return (
    <Page>

      <div className="hero">

        <div>

          <label>
            LLD PRACTICE WORKSPACE
          </label>

          <h1>
            Sharpen your design thinking.
          </h1>

          <p>
            Practice real-world low-level design,
            get explainable feedback, challenge
            your architecture, and improve through
            iteration.
          </p>

          <button
            className="primary"
            onClick={() => setView("problems")}
          >
            Explore problems →
          </button>

        </div>

        <div className="loop">
          PROBLEM <b>→</b> DESIGN <b>→</b> REVIEW{" "}
          <b>→</b> IMPROVE
        </div>

      </div>


      <div className="stats">

        <Stat
          number={attempts.length}
          title="Attempts"
        />

        <Stat
          number={completed}
          title="Completed"
        />

        <Stat
          number={average || 0}
          title="Avg score"
        />

        <Stat
          number={
            attempts.length
              ? Math.min(
                  99,
                  50 + completed * 7
                )
              : 0
          }
          title="Practice health"
        />

      </div>


      <Section
        title="Recommended problems"
        action="Browse all"
        click={() => setView("problems")}
      />


      <div className="cards">

        {problems
          .slice(0, 3)
          .map((problem) => (
            <Card
              problem={problem}
              attempts={attempts}
              start={start}
              key={problem.id}
            />
          ))}

      </div>


      {attempts[0] && (
        <>
          <Section
            title="Continue practicing"
            action="My attempts"
            click={() => setView("history")}
          />

          <div className="continue">

            <b>
              {attempts[0].problem.title}
            </b>

            <span>
              Latest attempt #{attempts[0].id}
              {" · "}
              {attempts[0].status}
              {" · "}
              {attempts[0].score ?? "—"}
              /100
            </span>

            <button
              onClick={() =>
                openAttempt(attempts[0].id)
              }
            >
              Review →
            </button>

          </div>
        </>
      )}

    </Page>
  );
}


/*
 * ============================================================
 * STAT
 * ============================================================
 */

function Stat({ number, title }) {
  return (
    <div className="stat">
      <small>{title}</small>
      <strong>{number}</strong>
    </div>
  );
}


/*
 * ============================================================
 * SECTION
 * ============================================================
 */

function Section({
  title,
  action,
  click,
}) {
  return (
    <div className="section">

      <h2>{title}</h2>

      <button onClick={click}>
        {action} →
      </button>

    </div>
  );
}


/*
 * ============================================================
 * PROBLEM CARD
 * ============================================================
 */

function Card({
  problem,
  attempts,
  start,
}) {
  return (
    <article className="card">

      <div className="cardtop">

        <b>
          {problem.title[0]}
        </b>

        <em>
          {problem.difficulty}
        </em>

      </div>

      <h3>
        {problem.title}
      </h3>

      <p>
        {problem.statement}
      </p>

      <div className="tags">

        {(problem.topics ||
          "OOP,SOLID,Patterns")
          .split(",")
          .slice(0, 4)
          .map((topic) => (
            <span key={topic}>
              {topic}
            </span>
          ))}

      </div>

      <footer>

        <small>
          {
            attempts.filter(
              (attempt) =>
                attempt.problem?.id ===
                problem.id
            ).length || "No"
          }{" "}
          attempts
        </small>

        <button
          className="primary small"
          onClick={() => start(problem)}
        >
          Start →
        </button>

      </footer>

    </article>
  );
}


/*
 * ============================================================
 * PROBLEM EXPLORER
 * ============================================================
 */

function Problems({
  problems,
  attempts,
  start,
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] =
    useState("ALL");

  const list = problems
    .filter((problem) =>
      (
        problem.title +
        " " +
        problem.statement +
        " " +
        problem.topics
      )
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .filter(
      (problem) =>
        difficulty === "ALL" ||
        problem.difficulty === difficulty
    );

  return (
    <Page>

      <label>LIBRARY</label>

      <h1>
        Problem Explorer
      </h1>

      <p className="muted">
        Search by problem, concept or design
        pattern.
      </p>

      <div className="filters">

        <input
          placeholder="⌕  Search LLD problems..."
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
        />

        {[
          "ALL",
          "EASY",
          "MEDIUM",
          "HARD",
        ].map((item) => (
          <button
            className={
              difficulty === item
                ? "selected"
                : ""
            }
            key={item}
            onClick={() =>
              setDifficulty(item)
            }
          >
            {item[0] +
              item.slice(1).toLowerCase()}
          </button>
        ))}

      </div>


      <div className="cards">

        {list.map((problem) => (
          <Card
            problem={problem}
            attempts={attempts}
            start={start}
            key={problem.id}
          />
        ))}

      </div>

    </Page>
  );
}


/*
 * ============================================================
 * WORKSPACE
 * ============================================================
 */

function Workspace({
  active,
  save,
  submit,
  back,
}) {
  const [tab, setTab] =
    useState("design");

  const [data, setData] =
    useState({
      ...emptyDesign,
      ...active.attempt,
    });

  const [saved, setSaved] =
    useState(true);


  function set(field, value) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }


  async function onSave() {
    await save(data);
    setSaved(true);
  }


  return (
    <Page>

      <button
        className="back"
        onClick={back}
      >
        ← Problems
      </button>


      <div className="workhead">

        <div>

          <em>
            {active.problem.difficulty}
          </em>

          <h1>
            {active.problem.title}
          </h1>

        </div>

        <span>
          {saved
            ? "● Saved"
            : "● Unsaved changes"}
        </span>

      </div>


      <div className="workspace">

        <aside className="problem">

          <label>PROBLEM</label>

          <h3>
            {active.problem.title}
          </h3>

          <p>
            {active.problem.statement}
          </p>

          <hr />

          <b>Requirements</b>

          <p>
            {active.problem.requirements}
          </p>

          <div className="tip">
            💡 Strong LLD answers explain why
            responsibilities belong where they do.
          </div>

        </aside>


        <section className="editor">

          <div className="tabs">

            {[
              "design",
              "diagram",
              "review",
            ].map((item) => (
              <button
                className={
                  tab === item
                    ? "on"
                    : ""
                }
                onClick={() =>
                  setTab(item)
                }
                key={item}
              >
                {item}
              </button>
            ))}

          </div>


          {tab === "design" && (
            <div className="formpad">

              {[
                [
                  "assumptions",
                  "Assumptions",
                  "Clarify scope, constraints and assumptions.",
                ],
                [
                  "classesResponsibilities",
                  "Classes & responsibilities",
                  "List cohesive classes and one primary responsibility each.",
                ],
                [
                  "relationships",
                  "Relationships & dependencies",
                  "Explain associations, composition and interfaces.",
                ],
                [
                  "patterns",
                  "Patterns / OOP decisions",
                  "Explain why a pattern solves a concrete problem.",
                ],
                [
                  "tradeoffs",
                  "Trade-offs, edge cases & testability",
                  "Describe requirement changes and important edge cases.",
                ],
              ].map((item) => (
                <label
                  className="field"
                  key={item[0]}
                >

                  <b>{item[1]}</b>

                  <small>
                    {item[2]}
                  </small>

                  <textarea
                    value={
                      data[item[0]] || ""
                    }
                    onChange={(event) =>
                      set(
                        item[0],
                        event.target.value
                      )
                    }
                    placeholder={item[2]}
                  />

                </label>
              ))}


              <div className="actions">

                <button onClick={onSave}>
                  {saved
                    ? "Saved ✓"
                    : "Save draft"}
                </button>

                <button
                  className="primary submit"
                  onClick={() =>
                    submit(data)
                  }
                >
                  Submit for design review →
                </button>

              </div>

            </div>
          )}


          {tab === "diagram" && (
            <Diagram
              data={data}
              set={set}
            />
          )}


          {tab === "review" && (
            <div className="empty">
              Submit your design to unlock
              the review.
            </div>
          )}

        </section>


        <aside className="checks">

          <label>
            DESIGN CHECK
          </label>

          {[
            "Requirements",
            "Responsibilities",
            "Abstraction",
            "Extensibility",
            "Testability",
          ].map((item, index) => (
            <div
              className="check"
              key={item}
            >
              <span>
                {index < 2 ? "✓" : "○"}
              </span>

              {item}
            </div>
          ))}

        </aside>

      </div>

    </Page>
  );
}


/*
 * ============================================================
 * DIAGRAM
 * ============================================================
 */

function Diagram({
  data,
  set,
}) {
  const nodes = (() => {
    try {
      return JSON.parse(
        data.diagramJson || "[]"
      );
    } catch {
      return [];
    }
  })();


  function add(type) {
    const node = {
      id: Date.now(),
      type,
      name:
        type === "interface"
          ? "PaymentStrategy"
          : "NewClass",
      responsibility:
        "Single cohesive responsibility",
    };

    set(
      "diagramJson",
      JSON.stringify([
        ...nodes,
        node,
      ])
    );
  }


  return (
    <div className="diagram">

      <div className="tools">

        <button
          onClick={() =>
            add("class")
          }
        >
          + Class
        </button>

        <button
          onClick={() =>
            add("interface")
          }
        >
          + Interface
        </button>

        <button
          onClick={() =>
            add("relationship")
          }
        >
          + Relationship
        </button>

      </div>


      <div className="canvas">

        <div className="uml mainuml">

          <b>
            {
              data.classesResponsibilities
                ?.split("\n")[0] ||
              "ParkingLot"
            }
          </b>

          <hr />

          - state
          <br />
          - collaborators

          <hr />

          + execute()
          <br />
          + validate()

        </div>


        {nodes
          .slice(0, 6)
          .map((node, index) => (
            <div
              className="uml"
              style={{
                left:
                  30 +
                  (index % 3) * 27 +
                  "%",
                top:
                  210 +
                  Math.floor(
                    index / 3
                  ) *
                    130,
              }}
              key={node.id}
            >

              <b>
                {node.name}
              </b>

              <hr />

              {node.type}

              <br />

              <small>
                {node.responsibility}
              </small>

            </div>
          ))}

      </div>


      <p>
        {nodes.length} diagram element(s)
        · persisted with this attempt.
      </p>

    </div>
  );
}


/*
 * ============================================================
 * REVIEW
 * ============================================================
 */

function Review({
  active,
  evaluation,
  retry,
  back,
  save,
}) {
  const criteria = evaluation
    ? JSON.parse(
        evaluation.feedbackJson
      )
    : [];

  const problem = active.problem;


  return (
    <Page>

      <button
        className="back"
        onClick={back}
      >
        ← My Attempts
      </button>


      <div className="reviewhead">

        <div className="score">

          <b>
            {evaluation?.totalScore || 0}
          </b>

          <small>
            /100
          </small>

        </div>


        <div>

          <label>
            DESIGN REVIEW · ATTEMPT #
            {active.attempt.id}
          </label>

          <h1>
            {problem.title}
          </h1>

          <p className="muted">
            Evidence-based feedback across
            requirements, responsibilities,
            abstraction, extensibility and
            testability.
          </p>

        </div>


        <button
          className="primary"
          onClick={retry}
        >
          Retry →
        </button>

      </div>


      <div className="reviewgrid">

        <section>

          <h2>
            Rubric breakdown
          </h2>

          {criteria.map((item) => (
            <div
              className="criterion"
              key={item.criterion}
            >

              <div>

                <b>
                  {item.criterion}
                </b>

                <strong>
                  {item.score}/
                  {item.maxScore}
                </strong>

              </div>

              <progress
                value={item.score}
                max={item.maxScore}
              />

              <p>
                <b>Evidence:</b>{" "}
                {item.evidence}
              </p>

              <p>
                <b>Concern:</b>{" "}
                {item.concern}
              </p>

              <p>
                <b>Suggestion:</b>{" "}
                {item.suggestion}
              </p>

            </div>
          ))}

        </section>


        <aside>

          <Challenge
            label="🔥 CHALLENGE YOUR DESIGN"
            title={
              problem.designChallenge
                ?.split(".")[0] ||
              "Challenge your architecture"
            }
            text={
              problem.designChallenge
            }
            field="challengeResponse"
            active={active}
            save={save}
          />


          <Challenge
            label="⚡ REQUIREMENT CHANGE"
            title="Evolve the design"
            text={
              problem.requirementChange
            }
            field="changeResponse"
            active={active}
            save={save}
          />


          <Comparison
            problemId={problem.id}
          />

        </aside>

      </div>

    </Page>
  );
}


/*
 * ============================================================
 * CHALLENGE
 * ============================================================
 */

function Challenge({
  label,
  title,
  text,
  field,
  active,
  save,
}) {
  const [value, setValue] =
    useState(
      active.attempt[field] || ""
    );

  const [result, setResult] =
    useState(null);

  const [busy, setBusy] =
    useState(false);


  const type =
    field === "changeResponse"
      ? "change"
      : "challenge";


  async function evaluate() {
    try {
      setBusy(true);

      await save({
        [field]: value,
      });

      const resultData = await request(
        `${API}/attempts/${active.attempt.id}/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            response: value,
          }),
        }
      );

      setResult(resultData);
    } catch (error) {
      console.error(
        "Challenge evaluation error:",
        error
      );
    } finally {
      setBusy(false);
    }
  }


  return (
    <div className="challenge">

      <label>
        {label}
      </label>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      <textarea
        value={value}
        onChange={(event) =>
          setValue(
            event.target.value
          )
        }
        placeholder="Explain how you would evolve the design..."
      />

      <button
        onClick={evaluate}
      >
        {busy
          ? "Evaluating…"
          : "Evaluate response"}
      </button>


      {result && (
        <div className="challenge-result">

          <b>
            {result.score}/100
          </b>

          <span>
            {result.feedback}
          </span>

        </div>
      )}

    </div>
  );
}


/*
 * ============================================================
 * ATTEMPT COMPARISON
 * ============================================================
 */

function Comparison({
  problemId,
}) {
  const [data, setData] =
    useState(null);

  useEffect(() => {
    request(
      `${API}/problems/${problemId}/compare`
    )
      .then(setData)
      .catch(() => {});
  }, [problemId]);


  if (!data) {
    return null;
  }


  return (
    <div className="challenge">

      <label>
        ↗ ATTEMPT COMPARISON
      </label>

      <h3>
        {
          data.attempts.length < 2
            ? "Build a second attempt"
            : "Improvement"
        }
      </h3>

      <p>
        {
          data.attempts.length < 2
            ? "Retry the problem and compare your architecture over time."
            : `Score movement: ${
                data.improvement >= 0
                  ? "+"
                  : ""
              }${data.improvement} points`
        }
      </p>


      {data.attempts
        .slice(-3)
        .map((item) => (
          <div
            className="compare"
            key={item.id}
          >
            Attempt #{item.attempt}

            <b>
              {item.score}/100
            </b>
          </div>
        ))}

    </div>
  );
}


/*
 * ============================================================
 * HISTORY
 * ============================================================
 */

function History({
  attempts,
  openAttempt,
}) {
  return (
    <Page>

      <label>
        LEARNING LOOP
      </label>

      <h1>
        My Attempts
      </h1>

      <p className="muted">
        Practice → Review → Retry → Compare.
      </p>


      <div className="table">

        {attempts.length ? (
          attempts.map((attempt) => (
            <div
              className="row"
              key={attempt.id}
            >

              <b>
                {attempt.problem.title}
              </b>

              <span>
                {attempt.status}
              </span>

              <small>
                #{attempt.id} ·{" "}
                {attempt.score ?? "—"}
                /100
              </small>

              <button
                onClick={() =>
                  openAttempt(
                    attempt.id
                  )
                }
              >
                Review →
              </button>

            </div>
          ))
        ) : (
          <div className="empty">
            No attempts yet. Start with
            Parking Lot.
          </div>
        )}

      </div>

    </Page>
  );
}


/*
 * ============================================================
 * PROGRESS
 * ============================================================
 */

function Progress({
  attempts,
}) {
  const [server, setServer] =
    useState(null);


  useEffect(() => {
    request(`${API}/progress`)
      .then(setServer)
      .catch(() => {});
  }, [attempts.length]);


  const score =
    server?.averageScore || 0;


  return (
    <Page>

      <label>
        PERSONAL ANALYTICS
      </label>

      <h1>
        Your design profile
      </h1>

      <p className="muted">
        Find recurring strengths and
        weaknesses across attempts.
      </p>


      <div className="profile">

        <div className="circle">

          <b>
            {score}%
          </b>

          <small>
            average
          </small>

        </div>


        <div>

          <h2>
            Design thinking
          </h2>

          <p>
            {server?.attempts || 0} attempts
            {" · "}
            {server?.completed || 0} completed.
            Keep practicing requirement changes
            and abstraction decisions to strengthen
            architecture under change.
          </p>

        </div>

      </div>


      <div className="skills">

        {[
          "Requirements",
          "Responsibilities",
          "Abstraction",
          "Coupling & Cohesion",
          "Extensibility",
          "Patterns",
          "Testability",
        ].map((item, index) => {

          const value = Math.min(
            96,
            Math.max(
              35,
              score - 8 + index * 3
            )
          );

          return (
            <div key={item}>

              <span>
                {item}
              </span>

              <progress
                value={value}
                max="100"
              />

              <b>
                {value}%
              </b>

            </div>
          );
        })}

      </div>


      <div className="weak">

        ⚠{" "}

        <b>
          Recurring weakness:{" "}
          {server?.weakness ||
            "Extensibility"}
        </b>

        <span>
          Practice{" "}
          {(
            server?.recommendations ||
            [
              "Strategy",
              "Dependency Inversion",
              "Requirement Change",
            ]
          ).join(", ")}
          .
        </span>

      </div>

    </Page>
  );
}


/*
 * ============================================================
 * PAGE WRAPPER
 * ============================================================
 */

function Page({
  children,
}) {
  return (
    <div className="page">
      {children}
    </div>
  );
}


/*
 * ============================================================
 * REACT ROOT
 * ============================================================
 */

createRoot(
  document.getElementById("root")
).render(
  <App />
);
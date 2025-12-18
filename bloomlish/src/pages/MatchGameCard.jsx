import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Tag, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";


export default function MatchGameCard() {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [correctPairs, setCorrectPairs] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState({}); // word -> meaning
  const [xpGiven, setXpGiven] = useState(false);
  const navigate = useNavigate();


  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const xpByLevel = {
    A1: 5,
    A2: 5,
    B1: 5,
    B2: 5,
    C1: 5,
  };
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex];
  const currentXP = xpByLevel[currentLevel];
  const ROUND_TIME = 40; // seconds
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    if (!words?.length) return;

    setIsLocked(false);
    setTimeLeft(ROUND_TIME);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsLocked(true);

          Modal.error({
            title: "Süre doldu ⏱",
            content: "Bu turu kaybettin. Yeni tur ile tekrar dene!",
            okText: "Yeni Tur",
            onOk: () => fetchRound(currentLevel),
          });

          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [words]); // yeni tur gelince reset


  const doneCount = useMemo(() => Object.keys(matched).length, [matched]);
  const total = useMemo(() => Object.keys(correctPairs).length, [correctPairs]);

  const fetchRound = async (level = currentLevel) => {
    setLoading(true);
    setSelectedWord(null);
    setMatched({});
    setXpGiven(false);
    try {
      const url = `http://localhost:8080/api/games/match/round?level=${level}&count=6&t=${Date.now()}`;
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setWords(data.words || []);
      setMeanings(data.meanings || []);
      setCorrectPairs(data.correctPairs || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRound();
  }, []);

  const onPickMeaning = (meaning) => {
    if (isLocked) return;

    if (!selectedWord) {
      message.info("Önce soldan bir kelime seç 🙂");
      return;
    }

    const correct = correctPairs[selectedWord] === meaning;

    if (correct) {
      setMatched((prev) => ({ ...prev, [selectedWord]: meaning }));
      setSelectedWord(null);
      message.success("Doğru!");
    } else {
      message.error("Yanlış eşleşme");

      setShakeSide("meaning");
      setTimeout(() => setShakeSide(null), 240);
    }
  };


  const isWordDone = (w) => matched[w] != null;
  const isMeaningUsed = (m) => Object.values(matched).includes(m);

  const finished = total > 0 && doneCount === total;

  useEffect(() => {
    if (!finished || xpGiven) return;

    setXpGiven(true);

    const giveXp = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/games/match/complete?level=${currentLevel}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        message.success(`+${data.xpGained} XP kazandın!`);

        // 🔥 HER YER HABER ALSIN
        window.dispatchEvent(new Event("xp-updated"));

      } catch (e) {
        message.error("XP kaydedilemedi");
      }
    };

    giveXp();

    // LEVEL GEÇİŞ MODALI
    if (levelIndex < levels.length - 1) {
      Modal.success({
        title: "Tebrikler 🎉",
        content: `${currentLevel} tamamlandı! ${levels[levelIndex + 1]} seviyesine geçtin.`,
        okText: "Devam",
        onOk: () => {
          const next = levelIndex + 1;
          setLevelIndex(next);
          setXpGiven(false); // 🔁 YENİ TUR İÇİN RESET
          fetchRound(levels[next]);
        },
      });
    }

  }, [finished, xpGiven]);



  const [shakeSide, setShakeSide] = useState(null); // "word" | "meaning" | null

  <style>{`
  @keyframes bloom-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .bloom-shake { animation: bloom-shake 220ms ease-in-out; }
  .wrong-flash { border: 1px solid #ff4d4f !important; box-shadow: 0 0 0 3px rgba(255,77,79,0.15) !important; }
`}</style>

  return (

    <Card
      title={
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Tag color="magenta">{currentLevel}</Tag>
          <b>Hızlı Eşleştirme</b>
          <Tag color={timeLeft <= 5 ? "red" : "pink"}>⏱ {timeLeft}s</Tag>

          <Tag color="pink">{doneCount}/{total}</Tag>


        </div>
      }
      extra={
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            onClick={() => navigate("/games")}
          >
            ← Oyunlara Dön
          </Button>

          <Button
            loading={loading}
            type="primary"
            onClick={() => {
              if (finished && levelIndex < levels.length - 1) {
                const next = levelIndex + 1;
                setLevelIndex(next);
                fetchRound(levels[next]);
              } else {
                fetchRound(currentLevel);
              }
            }}
          >
            Yeni Tur
          </Button>
        </div>
      }

      style={{ borderRadius: 16 }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* SOL: WORDS */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Kelimeler</div>
          <div style={{ display: "grid", gap: 10 }}>
            {words.map((w) => (
              <button
                key={w}
                disabled={isLocked || isWordDone(w)}
                onClick={() => setSelectedWord(w)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: selectedWord === w ? "2px solid #ff4da6" : "1px solid #eee",
                  background: isWordDone(w) ? "#f6ffed" : "white",
                  cursor: isWordDone(w) ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontWeight: 600 }}>{w}</span>
                  {isWordDone(w) && <Tag color="green">✓</Tag>}
                </div>
                {isWordDone(w) && (
                  <div style={{ opacity: 0.8, marginTop: 6 }}>
                    {matched[w]}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SAĞ: MEANINGS */}
        <div className={shakeSide === "meaning" ? "bloom-shake" : ""}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Anlamlar</div>
          <div style={{ display: "grid", gap: 10 }}>
            {meanings.map((m) => (
              <button className={shakeSide === "meaning" ? "wrong-flash" : ""}
                key={m}
                disabled={isLocked || isMeaningUsed(m)}
                onClick={() => onPickMeaning(m)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #eee",
                  background: isMeaningUsed(m) ? "#fafafa" : "white",
                  cursor: isMeaningUsed(m) ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12, opacity: 0.8 }}>
            Seçili kelime:{" "}
            <b style={{ color: "#ff4da6" }}>
              {selectedWord || "—"}
            </b>
          </div>

          {finished && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: "#fff0f6" }}>
              🎉 Hepsini eşleştirdin! Yeni tur açabilirsin.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 
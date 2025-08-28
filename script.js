
(() => {
  const display = document.getElementById("display");
  const hint = document.getElementById("hint");
  const keys = document.querySelector(".keys");

  function insert(v) {
    display.value += v;
    updateHint();
  }

  function clearAll() {
    display.value = "";
    hint.textContent = "";
  }

  function del() {
    display.value = display.value.slice(0, -1);
    updateHint();
  }

  function toExpr(s) {
    return s.replace(/×/g, "*").replace(/÷/g, "/");
  }

  function validExpr(s) {
    return /^[0-9+\-*/().\s]*$/.test(s);
  }

  function evalSafe(s) {
    if (!validExpr(s)) throw Error("Invalid");
    return Function(`"use strict";return (${s})`)();
  }

  function updateHint() {
    const s = toExpr(display.value);
    try {
      if (s.trim() === "") {
        hint.textContent = "";
        return;
      }
      const r = evalSafe(s);
      if (typeof r === "number" && isFinite(r)) {
        hint.textContent = r;
      } else {
        hint.textContent = "";
      }
    } catch {
      hint.textContent = "";
    }
  }

  function equals() {
    try {
      const r = evalSafe(toExpr(display.value));
      display.value = String(r);
      hint.textContent = "";
    } catch {
      hint.textContent = "Error";
    }
  }

  keys.addEventListener("click", (e) => {
    const b = e.target;
    if (b.dataset.val) insert(b.dataset.val);
    if (b.dataset.act === "clear") clearAll();
    if (b.dataset.act === "del") del();
    if (b.dataset.act === "equals") equals();
  });

  document.addEventListener("keydown", (e) => {
    const k = e.key;
    if ((k >= "0" && k <= "9") || "+-*/().".includes(k)) {
      insert(k);
    } else if (k === "Enter" || k === "=") {
      e.preventDefault();
      equals();
    } else if (k === "Backspace") {
      del();
    } else if (k === "Escape") {
      clearAll();
    } else if (k === "x") {
      insert("×");
    } else if (k === "/") {
      insert("÷");
    }
  });

  window.__calc = { clearAll, del, equals };
})();

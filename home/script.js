"use strict";

const eventDetails = {
  title: "윤춘석 님 백수연",
  address: "경상북도 영주시 풍기읍 풍기로 53",
  venue: "풍기관광호텔",
  start: "20261114T030000Z",
  end: "20261114T053000Z"
};

let statusTimer;
function showStatus(message) {
  const status = document.getElementById("status");
  status.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { status.textContent = ""; }, 4500);
}

async function copyText(text, message) {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    showStatus(message);
  } catch {
    window.prompt("아래 내용을 길게 누르거나 선택하여 복사해 주세요.", text);
  }
}

document.getElementById("copy-address").addEventListener("click", () => {
  copyText(eventDetails.address, "주소를 복사했습니다.");
});

document.getElementById("share-invitation").addEventListener("click", async () => {
  if (window.location.protocol === "file:") {
    showStatus("웹에 공개한 후 초대장 링크를 공유할 수 있습니다.");
    return;
  }
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: eventDetails.title, text: "윤춘석 님의 백수연에 모십니다.", url });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyText(url, "초대장 링크를 복사했습니다.");
});

document.getElementById("save-calendar").addEventListener("click", () => {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Family Invitation//KO", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", "UID:20261114-baeksuyeon@family-invitation", `DTSTAMP:${stamp}`,
    `DTSTART:${eventDetails.start}`, `DTEND:${eventDetails.end}`, `SUMMARY:${eventDetails.title}`,
    `LOCATION:${eventDetails.venue} ${eventDetails.address}`,
    "DESCRIPTION:윤춘석 님의 백수연에 모십니다. 축의금은 정중히 사양합니다.",
    "END:VEVENT", "END:VCALENDAR", ""
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "윤춘석님-백수연.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  showStatus("일정 파일을 열어 달력에 추가해 주세요.");
});

const todayInKorea = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit"
}).formatToParts(new Date());
const datePart = (type) => todayInKorea.find((part) => part.type === type).value;
const today = Date.UTC(Number(datePart("year")), Number(datePart("month")) - 1, Number(datePart("day")));
const daysLeft = Math.round((Date.UTC(2026, 10, 14) - today) / 86400000);
const countdown = document.getElementById("countdown");
if (daysLeft >= 0) {
  countdown.textContent = daysLeft === 0 ? "오늘, 소중한 자리에서 뵙겠습니다." : `함께할 날까지 ${daysLeft}일 남았습니다.`;
  countdown.hidden = false;
}

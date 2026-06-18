async function loadOilPrice() {
  try {
    const res = await fetch("oilprice.json?t=" + Date.now());

    if (!res.ok) throw new Error("oilprice.json 讀取失敗");

    const data = await res.json();

    document.getElementById("fuelType").innerHTML = `
      <option value="${data["92"]}">92無鉛</option>
      <option value="${data["95"]}" selected>95無鉛</option>
      <option value="${data["98"]}">98無鉛</option>
      <option value="${data["diesel"]}">超級柴油</option>
    `;

  } catch (err) {
    console.error("油價載入失敗", err);
  }
}

loadOilPrice();
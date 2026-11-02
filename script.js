// Número da barbearia (DDI + DDD + número, só dígitos)
const WHATSAPP = "5545999675992";
const SERVICOS = [
  ["Corte", "Tesoura ou máquina", 45],
  ["Barba na Maquina", "clássica", 15],
  ["Barboterapia", "premium", 35],
  ["COMBO", "cabelo + barba", 80],
  ["Limpeza de Pele", "Remoção de impurezas", 25],
  ["Pezinho", "Contorno do corte", 15],
  ["Platinado", "", 200],
  ["Sobrancelha", "Na navalha", 15]
];

const brl = v => v.toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const dataLocal = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const diaSemana = s => new Date(s + "T12:00").getDay();

$("menu").innerHTML = SERVICOS.map(([nome, desc, preco]) =>
  `<div class="item"><div><b>${nome}</b>${desc ? `<small>${desc}</small>` : ""}</div><i></i><span>${brl(preco)}</span></div>`).join("");
$("serv").innerHTML = SERVICOS.map(s => `<option>${s[0]} (${brl(s[2])})</option>`).join("");

// Data inicial: hoje, ou o próximo dia em que a barbearia abre (domingo fechado)
const hoje = dataLocal(new Date());
const d = new Date();
while (diaSemana(dataLocal(d)) === 0) d.setDate(d.getDate() + 1);
$("data").min = hoje;
$("data").value = dataLocal(d);

const link = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const oi = "Olá! Quero conhecer os serviços da barbearia.";
$("fab").href = link(oi); $("zapLink").href = link(oi);

const modal = $("modal");
$("abrir").onclick = () => modal.showModal();
$("fechar").onclick = () => modal.close();

$("form").addEventListener("submit", e => {
  e.preventDefault();
  const nome = $("nome").value.trim(), data = $("data").value;
  if (!nome) { $("err").textContent = "Digite seu nome para continuar."; return; }
  if (!data || data < hoje) { $("err").textContent = "Escolha uma data a partir de hoje."; return; }
  if (diaSemana(data) === 0) { $("err").textContent = "Domingo estamos fechados. Escolha outro dia."; return; }
  $("err").textContent = "";
  const [a, m, dia] = data.split("-");
  const msg = `Olá! Sou ${nome} e quero agendar: ${$("serv").value}, dia ${dia}/${m}/${a}. Qual horário podemos combinar?`;
  window.open(link(msg), "_blank", "noopener");
  modal.close();
});

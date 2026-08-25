const q_m3s = 0.001;
const cFactor = 150;
const d_m = 0.05;
const Hf = 10.67 * Math.pow(q_m3s, 1.85) / (Math.pow(cFactor, 1.85) * Math.pow(d_m, 4.87));
const Hf_2 = 10.67 * Math.pow(q_m3s/cFactor, 1.85) / Math.pow(d_m, 4.87);
const Hf_3 = 10.67 * Math.pow(q_m3s/cFactor, 1.852) / Math.pow(d_m, 4.87);

console.log("Hf:", Hf, "Hf_2:", Hf_2, "Hf_3:", Hf_3);

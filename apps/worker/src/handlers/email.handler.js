// export async function emailHandler(payload) {
//   console.log("\n📧 Sending Email...");
//   console.log(payload);

//   // simulate email sending
//   await new Promise((resolve) => setTimeout(resolve, 3000));

//   console.log("✅ Email Sent Successfully\n");
// }

export async function emailHandler(payload) {
  console.log("📧 Sending Email...");
  console.log(payload);

  throw new Error("SMTP Server Down");
}
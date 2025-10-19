export function otpTemplate(code: string) {
  return {
    subject: `Votre code de vérification : ${code}`,
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
        <h2>Code de vérification</h2>
        <p>Voici votre code pour confirmer ce nouvel appareil :</p>
        <p style="font-size:24px;font-weight:700;letter-spacing:2px">${code}</p>
        <p>Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
      </div>
    `,
    text: `Votre code de vérification: ${code}\nIl expire dans 10 minutes.`,
  };
}

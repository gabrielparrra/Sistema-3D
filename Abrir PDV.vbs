 Set WshShell = CreateObject("WScript.Shell")

' Executa o servidor do Next.js de forma TOTALMENTE INVISIVEL (0 = Oculto)
WshShell.Run "cmd /c ""npm run dev""", 0, false

' Espera 4 segundos para os motores ligarem (2000 milissegundos)
WScript.Sleep 2000

' Abre o navegador no link padrao
WshShell.Run "http://localhost:3000"

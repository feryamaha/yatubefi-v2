import fs from "fs";
import path from "path";

export default function handler(req, res) {
    if (req.method === "POST") {
        try {
            const updatedVideos = req.body;
            const filePath = path.join(process.cwd(), "data", "dynamic-videos.json");
            fs.writeFileSync(filePath, JSON.stringify(updatedVideos, null, 2));
            res.status(200).json({ message: "Vídeos atualizados com sucesso!" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao salvar vídeos" });
        }
    } else {
        res.status(405).json({ message: "Método não permitido" });
    }
}
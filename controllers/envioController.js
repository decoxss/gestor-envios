
import { Envio } from "../models/envio.js";

export class EnvioController {

    static registrar(datos) {
        const envio = new Envio(datos);
        envio.guardar();

        return envio;
    }

    static buscar(guia) {
        return Envio.buscar(guia.trim());
    }
}

namespace Coolguy_basic{
    //IRs
    let IR_ID = 0, IRData = [ 0, 0 ], IRCode = 0, Remote_type = 0, IR_INpin = DigitalPin.P0;
    let timeo = 273;

    function IR_Remote_Task(){
        let N: number = 0;
        while (!pins.digitalReadPin(IR_INpin)) {
            const t = control.millis();
            if (control.millis() - t > 10) basic.showString("entry"); return;
        }

        basic.showString(IR_Scan());
        IRCode = IRData[1];
        basic.pause(100);
        //IR_ClearFlay();
    }

    function NIR_Scan() {
        let IRCOM = [0, 0, 0, 0];
        while (pins.digitalReadPin(IR_INpin)) {
            const t = control.millis();
            if (control.millis() - t > 5) return "guide";
        }
        
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 8; j++){
                let ht = 0;
                while (!pins.digitalReadPin(IR_INpin)) {
                    const t = control.millis();
                    if (control.millis() - t > 1) return "low";
                }
                while (pins.digitalReadPin(IR_INpin)) {
                    const t = control.micros();
                    if ((ht = control.micros() - t) > 2000) return "high";
                }
                IRCOM[i] = IRCOM[i] >> 1;
                if (ht >= 400) IRCOM[i] = IRCOM[i] | 0x80;
            }
        }
        //if (IRCOM[2] + IRCOM[3] != 255) return "fit";

        if (IRCOM[2] > 1) {
            switch (IRCOM[2]) {
                case 0x40: IRData[1] = 1; break;
                case 0x19: IRData[1] = 2; break;
                case 0x07: IRData[1] = 3; break;
                case 0x09: IRData[1] = 4; break;
                case 0x18: IRData[1] = 5; break;
                case 0x52: IRData[1] = 6; break;
                case 0x08: IRData[1] = 7; break;
                case 0x5A: IRData[1] = 8; break;
                default: IRData[1] = 0; break;
            }
        }
        return "complete";
    }

    function IR_Scan() {
        let IRCOM = [0, 0];

        while (pins.digitalReadPin(IR_INpin)) {
            const t = control.micros();
            if (control.micros() - t > 100000) return "guide";
        }
        let ht:int16 [] =[ 0, 0, 0, 0, 0, 0, 0, 0 ];
        for (let i = 0; i < 2; i++)
        {
            for (let j = 0; j < 8; j++)
            {
                let N = 0;
                while (!pins.digitalReadPin(IR_INpin)) {
                    //const t = control.micros();
                    if (++N > 1000) return "low";
                }
                N = 0;
                while (pins.digitalReadPin(IR_INpin)) {
                    //const t = control.micros();
                    if ((ht[j] = ++N) > 1000) return "high";
                }
                IRCOM[i] = IRCOM[i] >> 1;
                if (ht[j] >= 16) IRCOM[i] = IRCOM[i] | 0x80;
            }
        }
        //if (IRCOM[0] + IRCOM[1] !== 255) return "fit";

        if ((IRCOM[0] & 0x0f) == 0x0f) {
            if (((IRCOM[0] >> 4) & 0xf) == IR_ID) {
                IRData[0] = 0;
                IRData[1] = 0;
            }
        }
        else {
            if (((IRCOM[0] >> 4) & 0xf) <= 7)
                IRData[0] = IRCOM[0] >> 4;
            if ((IRCOM[0] & 0x0f) <= 8)
                IRData[1] = IRCOM[0] & 0x0f;
        }

        for (let i = 0; i < 8; i++){
            basic.showNumber(ht[i]);
            basic.showString("|");
        }
        return "complete";
    }

    function IR_ClearFlay() {
        if (Remote_type == 1) {
            IRData[1] = 0;
            IRCode = IRData[1];
        }
    }

    export function coolguy_IR_Init(exterpin: exter_ports) {
        switch (exterpin) {
            case exter_ports.J1:
                IR_INpin = DigitalPin.P0;
                break;
            case exter_ports.J2:
                IR_INpin = DigitalPin.P1;
                break;
            case exter_ports.J3:
                IR_INpin = DigitalPin.P2;
                break;
            case exter_ports.J4:
                IR_INpin = DigitalPin.P16;
                break;
            case exter_ports.J5:
                IR_INpin = DigitalPin.P13;
                break;
            case exter_ports.J6:
                IR_INpin = DigitalPin.P15;
                break;
            default:
                break;
        }
    }
    
    let IRflag = 0;
    export function coolguy_IR_start() {
        IRflag = 1;
        control.inBackground(function () { while (IRflag) { IR_Remote_Task() } });
    }

    export function coolguy_IR_stop() {
        IRflag=0;
    }

    export function coolguy_IR_KeyValueCmp(channel: number, key: remote_key): number{
        IR_ID = channel - 1;
        if (IRData[0] == 0 && IRData[1] == 0) {
            if (key == 0) return 1;
        }
        else {
            if (key == IRCode && (IR_ID == IRData[0])) {
                return 1;
            }
        }
        return 0;
    }
    
    export function coolguy_IR_result() {
        basic.showNumber(IRData[1]);
    }
}
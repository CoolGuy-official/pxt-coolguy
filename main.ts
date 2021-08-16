enum motor_dir {
    //% block=正转
    FWD,
    //% block=反转
    REV
}

enum IR_state{
    //% block=开启
    Enable=1,
    //% block=关闭
    Disable=0
}

enum remote_key {
    //% block=无
    Non = 0,
    //% block=上
    Up = 1,
    //% block=下
    Down = 2,
    //% block=左
    Left = 3,
    //% block=右
    Right = 4,
    //% block=上+B
    Up_B = 5,
    //% block=下+B
    Down_B = 6,
    //% block=左+B
    Left_B = 7,
    //% block=右+B
    Right_B = 8
}

enum exter_ports {
    //% block="AD0"
    J1,
    //% block="IO1"
    J2,
    //% block="IO2"
    J3,
    //% block="IO16"
    J4,
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum exter_ports1 {
    //% block="IO13/14"
    J5,
    //% block="IO15/16"
    J6
}

enum motor_ports {
    //% block="IO5/11"
    J7,
    //% block="IO8/12"
    J8
}

enum servo_ports {
    //% block="IO1"
    J2,
    //% block="IO2"
    J3,
    //% block="IO16"
    J4
}

enum CmpStr_dir {
    //% block="前面的"
    ToBefore,
    //% block="后面的"
    ToAfter
}

/**
 * 酷哥基础
 */
//% weight=105 color=#ffc500 icon="\u272a"
//% groups=['字符串比较', '数码管', '红外遥控', '超声波模块', '电机', 'RGB', '其他']
//% block="酷哥基础"
namespace Coolguy_basic {
    //----------------------字符串比较---------------------------------
    let Cmpstring = "";
    
    /**
     * 设置比较字符串
     * @param str 作为比较的字符, 例如: hello
     */
    //% blockId=CmpStr_SetString
    //% block="设定比较的字符为 %str|"
    //% group=字符串比较
    export function CmpStr_SetString(str: string) {
        Cmpstring = str;
    }

    /**
     * 获取比较内容
     */
    //% blockId=CmpStr_GetString
    //% block="获取要比较的字符串"
    //% group=字符串比较
    export function CmpStr_GetString(): string {
        return Cmpstring;
    }

    /**
     * 与比较字符是否相同 
     */
    //% blockId=CmpStr_StringEqual
    //% block="比较内容和 %str| 相同吗"
    //% group=字符串比较
    export function CmpStr_StringEqual(str: string): boolean {
        if(str === Cmpstring)
            return true;    
        
        return false;
    }

    /**
     * 是否包含在比较字符中
     */
    //% blockId=CmpStr_IncludeString
    //% block="比较字符是否包含 %str|"
    //% group=字符串比较
    export function CmpStr_IncludeString(str: string): boolean {     
        if(Cmpstring.includes(str))
            return true;
        
        return false;
    }

    /**
     * 从指定内容前或后获取数字
     */
    //% blockId=CmpStr_Content_ToInt
    //% block="从比较内容提取 %String_part| %position| 的数字"
    //% group=字符串比较
    export function CmpStr_Content_ToInt(String_part: string, position: CmpStr_dir): number {
        let s_position = Cmpstring.indexOf(String_part);

        if(s_position == -1)
            return -1;
        else 
        {
            let comdata = "";
            let clocktime = 0;
            let times = 1;
            let num = "";

            if(position == CmpStr_dir.ToBefore) {
                comdata = Cmpstring.substr(0, s_position);
                for(let i = s_position - 1; i >= 0; i --) {
                    num = comdata.charAt(i);
                    if( num >= '0' && num <= '9') {
                        clocktime += (num.charCodeAt(0) - '0'.charCodeAt(0)) * times;
                        times *= 10;
                    }
                    else if(i == s_position - 1)
                        return -1;
                    else
                        break;	
                }
                return clocktime;
            }
            else {
                comdata = Cmpstring.substr( s_position + String_part.length, Cmpstring.length );
                for(let i = 0; i < comdata.length; i ++) {
                    num = comdata.charAt(i);
                    if( num >= '0' && num <= '9') {
                        clocktime *= 10;
                        clocktime += (num.charCodeAt(0) - '0'.charCodeAt(0));
                    }
                    else if(i == 0)
                        return -1;
                    else
                        break;	
                }
                return clocktime;
            }
        }
    }

    /**
     * 从指定内容前或后获取字符
     */
    //% blockId=CmpStr_Content_ToString
    //% block="从比较内容提取 %String_part| %position| 的文本"
    //% group=字符串比较
    export function CmpStr_Content_ToString(String_part: string, position: CmpStr_dir): string {
        let s_position = Cmpstring.indexOf(String_part);
        let comdata = "";

        if(s_position == -1)
            comdata = "NULL";
        else {
            if(position == CmpStr_dir.ToBefore)
                comdata = Cmpstring.substr(0, s_position);
            else
                comdata = Cmpstring.substr( s_position + String_part.length, Cmpstring.length );
        }
        return comdata;
    }
    
    //----------------------数码管-----------------------------------
    let Segment_SCL: DigitalPin;
    let Segment_SDA: DigitalPin;

    /**
     * 数码管初始化
     */
    //% blockId=Segment_Init
    //% block="数码管初始化到引脚%exterpin|"
    //% group=数码管
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function Segment_Init(exterpin: exter_ports1) {
        switch (exterpin) {
            case exter_ports1.J5:
                Segment_SCL = DigitalPin.P14;
                Segment_SDA = DigitalPin.P13;
                break;
            case exter_ports1.J6:
                Segment_SCL = DigitalPin.P16;
                Segment_SDA = DigitalPin.P15;
                break;
            default:
                break;
        }
    }

    function Segment_Start() {
        pins.digitalWritePin(Segment_SDA, 0);    //SDA 输出低电平
        control.waitMicros(100);                 //delay 100us
    }

    function Segment_Send_Byte(dat: number) {
        let i: number, testb: number;

        for (i = 0; i < 8; i++) {
            pins.digitalWritePin(Segment_SCL, 0);    //SCL 拉低 

            if (dat & 0x01)//判断是否发高电平 
            {
                pins.digitalWritePin(Segment_SDA, 1);    //SDA 拉高 
            }
            else {
                pins.digitalWritePin(Segment_SDA, 0);  //SDA 拉低 
            }
            dat = dat >> 1;

            control.waitMicros(100);   //延迟100us 
            pins.digitalWritePin(Segment_SCL, 1);    //SCL 拉高 
            control.waitMicros(100);   //延迟100us
        }
    }

    function Segment_Read_Byte(): number {
        let j: number, dat = 0;

        for (j = 0; j < 8; j++) {
            pins.digitalWritePin(Segment_SCL, 0);     //SCL 下拉
            control.waitMicros(100);  //延时 100us

            pins.digitalWritePin(Segment_SCL, 1);    //SCL 上拉

            dat >>= 1;
            if (pins.digitalReadPin(Segment_SDA))      //如果读入高，则或上高电平，再右移 ；如果为低，则跳过if语句，仍右移 
            {
                dat |= 0x80;
            }
            control.waitMicros(100);
        }

        return dat;
    }

    /**
     * 数码管显示
     */
    //% blockId=coolguy_Set_Segment
    //% block="数码管显示%num|"
    //% group=数码管
    export function coolguy_Set_Segment(num: number): void {
        let i: number;
        let num_int: number;
        let num1: number, num2: number, num3: number, num4: number, Digitalflag: number;
        num_int = (num * 10);//change the double-type num to long-int-type num_int
        if (!(num_int % 10))//to judge if the double-type num has zero decimals.
        {
            num_int = num_int / 10;
            Digitalflag = 0x01;//if the double-type num has zero decimals, then Digitalflag is 0x01
        }
        else {
            num_int = num_int % 10000;
            Digitalflag = 0x02;//if the double-type num has non-zero decimals, then Digitalflag is 0x02
        }
        num1 = num_int / 1000;//the first number to show
        num2 = (num_int % 1000) / 100;//the second number to show
        num3 = ((num_int % 1000) % 100) / 10;//the third number to show
        num4 = ((num_int % 1000) % 100) % 10;//the fourth number to show

        Segment_Start();
        Segment_Send_Byte(0x05);//表示前面发送了5个字节 
        Segment_Send_Byte(num1);
        Segment_Send_Byte(num2);
        Segment_Send_Byte(num3);
        Segment_Send_Byte(num4);
        Segment_Send_Byte(Digitalflag);
        i = Segment_Read_Byte();

        basic.pause(1); //加上延时，避免一直发数据 
    }

    /**
     * 数码管显示
     */
    //% blockId=coolguy_Set_Segment2
    //% block="数码管显示%num1|:%num2|"
    //% group=数码管
    export function coolguy_Set_Segment2(num1: number, num2: number) {
        let i: number;
        Segment_Start();
        Segment_Send_Byte(0x02);//表示前面发送了两个字节 
        Segment_Send_Byte(num1);
        Segment_Send_Byte(num2);
        i = Segment_Read_Byte();

        basic.pause(1); //加上延时，避免一直发数据 
    }

    //--------------------------红外遥控---------------------------------------
    let IR_ID = 0;
    let IRData = [0, 0];
    let IRCode = 0;
    let IR_INpin = DigitalPin.P0;

    function IR_Remote_Task() {
        let t = control.millis();
        while (!pins.digitalReadPin(IR_INpin))            //等IR变为高电平，跳过9ms的前导低电平信号
        {
            if (control.millis() - t >= 20) {
                return;
            }
        }

        if(IR_choose()){
            NIR_Scan();       //V2
        }
        else{
            IR_Scan();        //V1
        }

        IRCode = IRData[1];

        basic.pause(100);
        IR_ClearFlay();
    }

    function NIR_Scan() {
        let j: number, k: number;
        let IRCOM = [0, 0];
        let buf = [0, 0, 0, 0, 0, 0, 0, 0];
        let t = control.millis();
        while (pins.digitalReadPin(IR_INpin)) {
            if (control.millis() - t >= 10000) return;
        }
        for (j = 0; j < 2; j++)         //收集2组数据
        {
            for (k = 0; k < 8; k++)        //每组数据8位
            {
                t = control.millis();
                while (!pins.digitalReadPin(IR_INpin))          //等待 IR 变为高电电平
                {
                    if (control.millis() - t > 3000) {
                        return;
                    }
                }
                t = control.micros();
                while (pins.digitalReadPin(IR_INpin))           //计算IR高电平时间
                {
                    if ((buf[k]=control.micros()-t) >= 3000)
                        return;                                 //计数过长自动离开
                    control.waitMicros(10);
                }
                IRCOM[j] = IRCOM[j] >> 1;
                if (buf[k] >= 400) {
                    IRCOM[j] = IRCOM[j] | 0x80; //数据最高位补1
                }
            }//end for k
        }//end for j



        if (IRCOM[0] + IRCOM[1] !== 255)
            return;

        if ((IRCOM[0] & 0x0f) == 0x0f) {
            if (((IRCOM[0] >> 4) & 0xf) == IR_ID) {
                IRData[0] = 0;
                IRData[1] = 0;
            }
        }
        else {
                IRData[0] = ((IRCOM[0] >> 4)) / 2;
                IRData[1] = ((IRCOM[0] & 0x0f) - 1) / 2;
        }
        return;
    }

    function IR_Scan() {
        let j: number, k: number;
        let IRCOM = [0, 0];
        let buf = [0, 0, 0, 0, 0, 0, 0, 0];
        let t = control.millis();
        while (pins.digitalReadPin(IR_INpin)) {
            if (control.millis() - t >= 10000) return;
        }
        for (j = 0; j < 2; j++)         //收集2组数据
        {
            for (k = 0; k < 8; k++)        //每组数据8位
            {
                t = control.millis();
                while (!pins.digitalReadPin(IR_INpin))          //等待 IR 变为高电电平
                {
                    if (control.millis() - t > 3000) {
                        return;
                    }
                }
                t = control.micros();
                while (pins.digitalReadPin(IR_INpin))           //计算IR高电平时间
                {
                    if ((buf[k]=control.micros()-t) >= 3000)
                        return;                                 //计数过长自动离开
                    control.waitMicros(10);
                }
                IRCOM[j] = IRCOM[j] >> 1;
                if (buf[k] >= 275) {
                    IRCOM[j] = IRCOM[j] | 0x80; //数据最高位补1
                }
            }//end for k
        }//end for j
        
        if ((IRCOM[0] & 0x0f) == 0x0f) {
            if (((IRCOM[0] >> 4) & 0xf) == IR_ID) {
                IRData[0] = 0;
                IRData[1] = 0;
            }
        }
        else {
                IRData[0] = ((IRCOM[0] >> 4)) / 2;
                IRData[1] = ((IRCOM[0] & 0x0f) - 1) / 2;
        }
        return;
    }
    
    function IR_ClearFlay() {
            IRData[1] = 0;
            IRCode = IRData[1];
    }

    /**
     * 红外遥控初始化
     */
    //% blockId=coolguy_IR_Init
    //% block="红外遥控初始化于引脚|%pin|"
    //% group=红外遥控
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
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

    /**
     * 设置红外遥控接收状态
     */
    //% blockId=coolguy_IR_setstate
    //% block="红外遥控接收%state|"
    //% group=红外遥控
    export function coolguy_IR_setstate(status: IR_state) {
        state = status;
        if (state) {
            control.inBackground(function () { while (state) { IR_Remote_Task() } });
        }
    }
    let state: IR_state;
    /**
     * IR_Remote
     * @param channel 遥控器通道，例如：1
     */
    //% blockId=coolguy_IR_KeyValueCmp
    //% block="遥控通道%channel|%key|键按下"
    //% channel.min=1   channel.max=8
    //% group=红外遥控
    export function coolguy_IR_KeyValueCmp(channel: number, key: remote_key): boolean {
        IR_ID = channel - 1;  //获取通道

        if (IRData[0] === 0 && IRData[1] === 0)  //是否松开
        {
            if (key === 0) return true;
        }
        else {
            if (key === IRCode && ((channel - 1) === IRData[0])) {
                return true;
            }
        }
        return false;
    }
    
    //---------------------UltrasoundWave读取函数--------------------------------------
    let ultrasonic_tri = DigitalPin.P15;
    let ultrasonic_ech = DigitalPin.P16;

    /**
     * 超声波模块初始化
     */
    //% blockId=ultrasonic_Init
    //% block="超声波模块初始化到%exterpin|"
    //% group=超声波模块
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    export function ultrasonic_Init(exterpin: exter_ports1) {
        switch (exterpin) {
            case exter_ports1.J5:
                ultrasonic_tri = DigitalPin.P13;
                ultrasonic_ech = DigitalPin.P14;
                break;
            case exter_ports1.J6:
                ultrasonic_tri = DigitalPin.P15;
                ultrasonic_ech = DigitalPin.P16;
                break;
            default:
                break;
        }
    }

    function ultrasonic_read(): number {
        let t: number;
        pins.digitalWritePin(ultrasonic_tri, 0);
        control.waitMicros(2);
        pins.digitalWritePin(ultrasonic_tri, 1);
        control.waitMicros(20);
        pins.digitalWritePin(ultrasonic_tri, 0);    //triggle

        t = pins.pulseIn(ultrasonic_ech, PulseValue.High);
        return t / 58;   //CM
    }

    /**
     * 超声波距离读取
     */
    //% blockId=ultrasonic_get
    //% block="超声波距离读取"
    //% group=超声波模块
    export function ultrasonic_get(): number {
        let k = 0;
        let sum = 0;
        while (k < 2) {
            sum = sum + ultrasonic_read();
            k++;
        }
        sum = Math.floor(sum / k * 100) / 100;
        return sum;
    }

    //---------------------PM2.5-------------------------------------------------
    // /**
    //  * PM2.5读取
    //  */
    // //% blockId=Read_PM2_5
    // //% block="PM2.5读取"
    // //% group=其他
    // export function Read_PM2_5(): number {
    //     let voMeasured: number, calcVoltage: number, dustDensity: number;

    //     voMeasured = pins.analogReadPin(AnalogPin.P0); // read the dust value
    //     calcVoltage = voMeasured * (5.0 / 1024.0);
    //     dustDensity = 0.17 * calcVoltage - 0.1;
    //     if (dustDensity < 0) 
    //         dustDensity = 0.1;

    //     return dustDensity;
    // }

    //----------------------RGB--------------------------------------------------
    let rgb = neopixel.create(DigitalPin.P1, 1, NeoPixelMode.RGB);
    
    /**
     * RGB
     * @param exterpin RGB接口, 例如: servo_ports.J2
     */
    //% blockId=coolguy_WS2812_Init
    //% block="设定RGB端口%exterpin"
    //% group=RGB
    export function coolguy_WS2812_Init(exterpin: servo_ports) {
        switch (exterpin) {
            case servo_ports.J2:
                rgb = neopixel.create(DigitalPin.P1, 1, NeoPixelMode.RGB);
                break;
            case servo_ports.J3:
                rgb = neopixel.create(DigitalPin.P2, 1, NeoPixelMode.RGB);
                break;
            case servo_ports.J4:
                rgb = neopixel.create(DigitalPin.P16, 1, NeoPixelMode.RGB);
                break;
            default:
                break;
        }
    }

    /**
     * RGB
     * @param brightness RGB亮度, 例如: 120
     * @param r 设定红色, 例如: 0
     * @param g 设定绿色, 例如: 0
     * @param b 设定蓝色, 例如: 255
     */
    //% blockId=coolguy_WS2812_SetRGB
    //% block="亮度 %brightness|红 %r|绿 %g|蓝 %b|"
    //% brightness.min=0 brightness.max=255
    //% r.min=0 r.max=255 g.min=0 g.max=255 b.min=0 b.max=255 
    //% inlineInputMode=inline
    //% group=RGB
    export function coolguy_WS2812_SetRGB(brightness: number, r: number, g: number, b: number) {       
        rgb.setBrightness(brightness);
        //rgb.show();
        rgb.showColor(neopixel.rgb(r, g, b));
    }

    /**
     * 外接按键检测
     * @param exterpin 按钮连接端口, 例如: exter_ports.J1
     */
    //% blockId=coolguy_exter_button
    //% block="当按键%pin|被松开时"
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    //% group=其他
    export function exter_button(exterpin: exter_ports): number {
        let pin: DigitalPin;

        switch (exterpin) {
            case exter_ports.J1:
                pin = DigitalPin.P0;
                break;
            case exter_ports.J2:
                pin = DigitalPin.P1;
                break;
            case exter_ports.J3:
                pin = DigitalPin.P2;
                break;
            case exter_ports.J4:
                pin = DigitalPin.P16;
                break;
            case exter_ports.J5:
                pin = DigitalPin.P13;
                break;
            case exter_ports.J6:
                pin = DigitalPin.P15;
                break;
            default:
                break;
        }

        if (!pins.digitalReadPin(pin)) {
            while (!pins.digitalReadPin(pin));
            return 1;
        }
        else {
            return 0;
        }
    }

    /**
     * 电机控制
     * @param exterpin 电机接口, 例如: motor_ports.J7
     * @param dir 电机转向, 例如: motor_dir.FWD
     * @param speed 电机转速(0到1023), 例如: 255
     */
    //% blockId=coolguy_extermotor_drive
    //% block="电机%exterpin|以%speed|速度%dir|转动" 
    //% speed.min=0 speed.max=255
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=2
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    //% group=电机
    export function exter_motor_drive(exterpin: motor_ports, speed: number, dir: motor_dir): void {
        let motor_pin1: AnalogPin;
        let motor_pin2: AnalogPin;

        switch (exterpin) {
            case motor_ports.J7:
                input.disableButtons();
//				setDigitalPin(5, 1);
//				setDigitalPin(11, 1);
                motor_pin1 = AnalogPin.P5;
                motor_pin2 = AnalogPin.P11;
                break;
            case motor_ports.J8:
                motor_pin1 = AnalogPin.P8;
                motor_pin2 = AnalogPin.P12;
                break;
            default:
                break;
        }

        switch (dir) {
            case motor_dir.FWD:
                pins.analogWritePin(motor_pin1, 0);
                pins.analogWritePin(motor_pin2, speed*4);
                pins.analogSetPeriod(motor_pin2, 20000);
                break;
            case motor_dir.REV:
                pins.analogWritePin(motor_pin2, 0);
                pins.analogWritePin(motor_pin1, speed*4);
                pins.analogSetPeriod(motor_pin1, 20000);
                break;
            default: break;
        }
    }

    /**
     * 小车前进
     * @param speed 小车速度, 例如: 255
     * 左电机: IO5/11
     * 右电机: IO8/12
     */
    //% blockId=coolguy_extermotor_go
    //% block="小车前进%speed|(速度)" 
    //% speed.min=0 speed.max=255
    //% group=电机
    export function exter_motor_go(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.FWD)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.REV)
    }

    /**
     * 小车后退
     * @param speed 小车速度, 例如: 255
     * 左电机: IO5/11
     * 右电机: IO8/12
     */
    //% blockId=coolguy_extermotor_back
    //% block="小车后退%speed|(速度)" 
    //% speed.min=0 speed.max=255
    //% group=电机
    export function exter_motor_back(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.REV)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.FWD)
    }

    /**
     * 小车停止
     * 左电机: IO5/11
     * 右电机: IO8/12
     */
    //% blockId=coolguy_extermotor_stop
    //% block="令小车停止" 
    //% group=电机
    export function exter_motor_stop(): void {
        exter_motor_drive(motor_ports.J7, 0, motor_dir.FWD)
        exter_motor_drive(motor_ports.J8, 0, motor_dir.REV)
    }

    /**
     * 小车左转(两轮反向)
     * @param speed 轮子速度, 例如: 255
     * 左电机: IO5/11
     * 右电机: IO8/12
     */
    //% blockId=coolguy_extermotor_left
    //% block="让小车左转 %speed|" 
    //% speed.min=0 speed.max=255
    //% group=电机
    export function exter_motor_left(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.REV)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.REV)
    }

    /**
     * 小车右转(两轮反向)
     * @param speed 轮子速度, 例如: 255
     * 左电机: IO5/11
     * 右电机: IO8/12
     */
    //% blockId=coolguy_extermotor_right
    //% block="让小车右转 %speed|" 
    //% speed.min=0 speed.max=255
    //% group=电机
    export function exter_motor_right(speed: number): void {
        exter_motor_drive(motor_ports.J7, speed, motor_dir.FWD)
        exter_motor_drive(motor_ports.J8, speed, motor_dir.FWD)
    }

    /**
     * 舵机控制
     * @param pin 舵机连接端口, 例如: AnalogPin.P0
     * @param val 舵机期望角度, 例如: 90
     */
    //% blockId=coolguy_servocontrol
    //% block="舵机连接至%pin|，舵机旋转%val|度"
    //% val.min=0 val.max=180
    //% exterpin.fieldEditor="gridpicker" exterpin.fieldOptions.columns=1
    //% exterpin.fieldOptions.tooltips="false" exterpin.fieldOptions.width="150"
    //% group=其他
    export function servo_control(exterpin: servo_ports, val: number) {
        let pin = AnalogPin.P1;
        switch (exterpin) {
            case servo_ports.J2:
                pin = AnalogPin.P1;
                break;
            case servo_ports.J3:
                pin = AnalogPin.P2;
                break;
            case servo_ports.J4:
                pin = AnalogPin.P16;
                break;
            default:
                break;
        }
        pins.servoWritePin(pin, val);
    }
}

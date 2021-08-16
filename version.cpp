#include "pxt.h"

using namespace pxt;

namespace input
{

    //%
    void enableButtons()
    {
#if MICROBIT_CODAL
        // V2 only
        uBit.buttonA.enable();
        uBit.buttonB.enable();
#endif
    }

    //%
    void disableButtons()
    {
#if MICROBIT_CODAL
        // V2 only
        uBit.buttonA.disable();
        uBit.buttonB.disable();
#endif
    }

}

namespace Coolguy_basic
{

    bool IR_choose()
    {
        if (MICROBIT_CODAL)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
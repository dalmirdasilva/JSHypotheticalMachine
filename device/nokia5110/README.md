# Nokia 5110 module

The format of command that is used to communicate with
LCD is divided into 2 modes; Command Mode and Data Mode. In
this case, it uses Pin D/C to divide and control signals; if
D/C = 0, the data that is sent to LCD is Command (see more
detailed information of commands in the Table 1); and if D/C =
1, the data that is sent to LCD wil1 be Data and it will
placed in DDRAM Memory (Display Data RAM) to be displayed on
LCD Display. After 1 byte data has already been written, 1
value of DDRAM address will be increased automatically.

## Commands Sets for controlling LCD Display

Table 1:

```
D/C   DB7   DB6   DB5   DB4   DB3   DB2   DB1   DB0
  0     0     0     0     0     0     0     0     0   -> No operation
  0     0     0     1     0     0    PD     V     H   -> Function set
  1    D7    D6    D5    D4    D3    D2    D1    D0   -> Write data
  0     0     0     0     0     1     D     0     E   -> Display control
  0     0     1     0     0     0    Y2    Y1    Y0   -> Set Y address
  0     1    X6    X5    X4    X3    X2    X1    X0   -> Set X address

PD:
  0: chip is active
  1: chip is is Power-down mode

V:
  0: Horizontal addressing
  1: Vertical addressing

H (NOT IMPLEMENTED): 
  0: Use basic instruction set
  1: Use extended instruction set

D and E:
  00: Display blank
  10: Normal mode
  01: All display segments on
  11: Inverse video mode
```

First memory address is used to for D/C.
Second memory address is used to DB bus.


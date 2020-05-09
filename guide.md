# A very rough and incomplete guide

This documentation is a work in progress. A friendlier guide and perhaps some video tutorials are on their way. I acknowledge and apologize for the amount of text on this page.



***in:verse*** is a puzzle in 3 parts -- shaders; stacks; and words. If you're unfamiliar with shaders, this might not make much sense right now, but perhaps it's enough to try some random things and see what happens.





## a little about the interface

* Code is compiled by hitting the `ENTER` key
* The word-table defines the mappings for English words to GLSL functions. `x` and `y` are the coordinates of the pixel, and `t` is time
* Words can be put on the same line or separate lines -- it mostly does not matter. The number of words in each line will affect the randomness in the program -- don't worry about it too much, just enjoy it.
* You will see the stack update with the underlying representation of your program. The interface has some example stacks (click the "!!!" button on the bottom-left) -- you can try re-creating these to start with.
* The *shuffle* button will randomly shuffle the assignment of words to GLSL functions. Sometimes fun things will happen.
* You can look at the compiled shader output in the console, if that's useful.





## a little about stacks

* Stack-based programming uses Reverse Polish Notation, if that means anything to you.
* In other words, instead of thinking of things in this order: `4 + 5` , think of them like this: `4 5 +`
* To do this, one would need to first put `4` on the stack, then put `5`, and then `+`. When the stack is evaluated, this will collapse to `9` ... ie, `4 5 +` will be replaced by `9` on the stack.
* Another example: to calculate  `(4 * 3) + 7`, the order of things on the stack would be `4 3 * 7 +`
* The resulting shader will evaluate the stack and use the last 3 values to determine the RGB channels. If there are not enough values, it will use random values.
* Sometimes you need to manipulate the stack. The `dup` function will duplicate  the last value on the stack, the `swap` will swap the last two values, `drop` will discard the last value, and `rotate` will pull the bottom value out and put it on top.





## a little about numbers

* To write numbers, one uses words.

* If you like symbols, here is the setup, where *W* is any word you want

  * <img src="https://render.githubusercontent.com/render/math?math=W^n, W^m">  **evaluates to** <img src="https://render.githubusercontent.com/render/math?math=n * 10^m">

  * <img src="https://render.githubusercontent.com/render/math?math=W^n... W^m">  **evaluates to** <img src="https://render.githubusercontent.com/render/math?math=n * 10^{-m}">

  * <img src="https://render.githubusercontent.com/render/math?math=N1">; <br>

    <img src="https://render.githubusercontent.com/render/math?math=N2"> <br>

    <img src="https://render.githubusercontent.com/render/math?math=N3">; <br>

    **evalauates to** $N1 + N2 + N3$




* If you don't like symbols, here is the setup:

  * To write the number `4`, use any 4 **words followed by a comma**. Ie, `word word word word,`

  * This is obviously very cumbersome to write big numbers. To write the number `40`, do the above, and add 1 more **word after the comma -- to signify the number of 0s** the number has.
    So, `word word word word, word` is `40`
    And `word word word word, word word` is `400`

  * What about numbers less than 0? Similar to the above, but use ellipses instead of a comma (ie `...` instead of `,`). The number of **words after the ellipses signify the number of decimal places** the number has.
    So, `word word word word ... word` is `0.4`
    And, `word word word word ... word word` is `0.04`


  * What about a number like `11.5` ? You can think of this as `10 + 1 + 0.5` . To save the hassle of repeatedly adding the numbers, you can use a **semi-colon (ie `;`) at the end of the first and last lines of the components of the number**.  

    ```
    word, word;
    word,
    word word word word word... word;
    ```

    The first line is `10`, the second is `1`, and the last is `0.5` . The `;` at the end of the first and last lines imply that this is the start and end of one number, and the parts should be summed up.





## a little about syntax

* Any line can be commented out by using an exclamation mark, ie `!`

* Sometimes you will want a function to take *groups* of numbers as arguments, ie `vec2` and `vec3` in GLSL world.

* This can be done by adding punctuation in a sentence, and the stack will also represent this with subscripts of `2` and `3`

* To have a function operate on `vec2` or *pairs* of numbers, use a period in the line, ie `.`  -- it does not matter where it is located, but it will apply to all function names in that line

* To have a function operate on `vec2` or *triples*, use a dash in the line, ie `-`  -- it does not matter where it is located, but it will apply to all function names in that line

* An example,
  Say the stack has ` 4 5 6 7 8 9 `

  * If a `+` is added to the stack, when it evaluates, it will collapse the last two elements, replacing them with `8 + 9`

  * If a `+` is added when there is a **period** in the sentence, it will operate on pairs of numbers:
    `4 5 (6+8) (7+9)`  which evaluates to `4 5 14 16`

  * If a `+` is added when there is a **dash** in the sentence, it will operate on *triples* :
    `(4+7) (5+8) (6+9)`  which evaluates to `11 13 15`

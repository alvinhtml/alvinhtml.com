# JavaScript 双向链表

在之前的文章中，我们使用 JavaScript 创建一个单向链表。单向链表由节点组成，每个节点都有一个指向列表中下一个节点的指针。单向链表通常需要遍历整个链表进行操作，因此通常性能较差。提高链表性能的一种方法是在每个节点上添加第二个指针，指向链表中的前一个节点。**节点既指向前一个节点又指向下一个节点的链表称为双向链表**。

## 设计一个双向链表

与单向链表类似，双向链表由一系列节点组成。每个节点包含一些数据以及指向列表中下一个节点的指针和指向前一个节点的指针。这是 JavaScript 中的一个简单表示：

```js
class DoublyLinkedListNode {
  constructor(data) {
    this.data = data
    this.next = null
    this.previous = null
  }
}
```

在 DoublyLinkedListNode 类中，data 属性包含链表项应存储的值，next 属性是指向列表中下一项的指针，而 previous 属性是指向列表中前一项的指针。next 和 previous 的初始值都是 `null`。接下来，你可以使用 DoublyLinkedListNode 类创建一个双向链表：

```
// create the first node
const head = new DoublyLinkedListNode(11)

// add a second node
const secondNode = new DoublyLinkedListNode(88)
head.next = secondNode
secondNode.previous = head

// add a third node
const thirdNode = new DoublyLinkedListNode(66)
secondNode.next = thirdNode
thirdNode.previous = secondNode

const tail = thirdNode
```

与单向链表一样，双向链表中的第一个节点称为头。第二个和第三个节点是通过使用每个节点上的 next 和 previous 指针来分配。下图显示了生成的数据结构。

![双向链表图](../../images/algorithm/doubly-linked-list.svg)

可以按照与单向链表相同的方式遍历双向链表，通过跟踪 next 每个节点上的指针，例如：

```js
let current = head

while (current !== null) {
  console.log(current.data)
  current = current.next
}
```

双向链表通常还跟踪列表中的最后一个节点，称为 tail。列表的尾部有助于跟踪新节点的插入和从列表的后面到前面的搜索。为此，您从尾部开始并按照 previous 链接进行操作，直到没有更多节点为止。以下代码反向遍历并打印出每个节点的值：

```
let current = tail

while (current !== null) {
  console.log(current.data)
  current = current.previous
}
```

通过允许双向搜索，即在遍历时可以前后移动，使得双向链表在遍历时表现出了优于单向链表的性能。

与单链表一样，操作双向链表中节点的操作最好封装在一个类中。以下是一个简单的例子：

```js
const head = Symbol('head')
const tail = Symbol('tail')

class DoublyLinkedList {
  constructor() {
    this[head] = null
    this[tail] = null
  }
}
```

DoublyLinkedList 类代表一个双向链表，并将包含与数据交互的方法。有两个 Symbol 属性 head 和 tail，分别用于跟踪列表中的第一个和最后一个节点。与单向链表一样，head 和 tail 不允许从外部访问。

## 向链表中添加新数据

将项目添加到双向链表与添加到单链表非常相似。在这两种数据结构中，您必须首先找到列表中的最后一个节点，然后在其后添加一个新节点。在单向链表中，您必须遍历整个链表以找到最后一个节点，而在双向链表中，使用该 `this[tail]` 属性就能直接获取最后一个节点。

为 DoublyLinkedList 添加一个 `add()` 方法：

```js
class DoublyLinkedList {
  constructor() {
    this[head] = null
    this[tail] = null
  }

  add(data) {
    // create the new node and place the data in it
    const newNode = new DoublyLinkedListNode(data)

    // special case: no nodes in the list yet
    if (this[head] === null) {
      this[head] = newNode
    } else {
      // link the current tail and new tail
      this[tail].next = newNode
      newNode.previous = this[tail]
    }

    // reassign the tail to be the new node
    this[tail] = newNode
  }
}
```

`add()` 方法接受一个参数，即要插入到列表中的数据。如果列表为空（既 `this[head]` 和 `this[tail]` 都是 `null`），则新节点被分配给 `this[head]`。如果列表不为空，则在当前 `this[tail]` 节点之后添加一个新节点。最后一步是设置 `this[tail]` 为 newNode，因为在空列表和非空列表中，新节点将始终是最后一个节点。

请注意，在空列表的情况下，`this[head]` 和 `this[tail]` 设置为相同的节点。这是因为单节点列表中的单个节点同时是该列表中的第一个节点和最后一个节点。保持对列表尾部的正确跟踪很重要，以便在必要时可以反向遍历列表。

`add()` 方法的复杂度为 O(1)。对于空列表和非空列表，操作都不需要任何遍历，因此，比起仅跟踪列表头的单链表，复杂度要低很多。

## 从列表中检索数据

获取双向链表的方法跟获取单向链表一样，在这两种链表中，您都必须从头遍历列表 `this[head]` 并跟踪已看到的节点数以确定何时找到正确的节点：

```js
class DoublyLinkedList {
  constructor() {
    this[head] = null
    this[tail] = null
  }

  // other methods hidden for clarity

  get(index) {
    // ensure `index` is a positive value
    if (index > -1) {
      // the pointer to use for traversal
      let current = this[head]
      // used to keep track of where in the list you are
      let i = 0
      // traverse the list until you reach either the end or the index
      while ((current !== null) && (i < index)) {
        current = current.next
        i++
      }
      // return the data if `current` isn't null
      return current !== null ? current.data : undefined
    } else {
      return undefined
    }
  }
}
```

和单链表一样，`get()` 方法的复杂度从移除第一个节点时的 O(1)（不需要遍历）到移除最后一个节点时的 O(n)（需要遍历整个列表）。

## 从双向链表中删除数据

从双向链表中移除数据的算法本质上与单链表相同：首先遍历数据结构以找到给定位置的节点（与 `get()` 算法相同），然后将其从链表中移除。与单链表中使用的算法的唯一显着区别是：

1. 不需要 previous 变量来跟踪循环中的一个节点，因为前一个节点始终可用通过 `current.previous` 找到。
2. 需要注意列表中最后一个节点的更改以确保 `this[tail]` 保持正确。

`remove()` 方法看起来与单链表的方法非常相似：


```js
class DoublyLinkedList {
  constructor() {
    this[head] = null
    this[tail] = null
  }

  // other methods hidden for clarity

  remove(index) {
    // special cases: no nodes in the list or `index` is negative
    if ((this[head] === null) || (index < 0)) {
      throw new RangeError(`Index ${index} does not exist in the list.`)
    }

    // special case: removing the first node
    if (index === 0) {
      // store the data from the current head
      const data = this[head].data

      // just replace the head with the next node in the list
      this[head] = this[head].next

      // special case: there was only one node, so also reset `this[tail]`
      if (this[head] === null) {
        this[tail] = null
      } else {
        this[head].previous = null
      }

      // return the data at the previous head of the list
      return data
    }

    // pointer use to traverse the list
    let current = this[head]

    // used to track how deep into the list you are
    let i = 0

    // same loop as in `get()`
    while ((current !== null) && (i < index)) {

      // traverse to the next node
      current = current.next

      // increment the count
      i++
    }

    // if node was found, remove it
    if (current !== null) {

      // skip over the node to remove
      current.previous.next = current.next

      // special case: this is the last node so reset `this[tail]`.
      if (this[tail] === current) {
        this[tail] = current.previous
      } else {
        current.next.previous = current.previous
      }

      // return the value that was just removed from the list
      return current.data
    }

    // if node wasn't found, throw an error
    throw new RangeError(`Index ${index} does not exist in the list.`)
  }
}
```

当 index 为 0 时，意味着第一个节点被删除，`this[head]` 设置为 `this[head].next`，与单链表相同。当您需要更新其他指针时，差异就出现在这一点之后。如果在列表中只有一个节点，那么你需要设置 `this[tail]` 的值为 `null` 来去除第一个节点; 如果有多个节点，则需要设置 `this[head].previous` 为 `null`，请注意，此时新的头部是列表中的第二个节点，并且它的 previous 链接指向刚刚删除的节点。

当 index 不为 0 时，像 `get()` 方法中那样遍历节点，直到找到要删除的节点，将这个节点  `current.next.previous` 设置为 `current.previous`，即将要删除的节点的前一个节点和它后一个节点相链接。 当然，如果要删除的节点是最后一个节点，则需要更新 `this[tail]` 指针。

## 创建反向迭代器

您可以像单链表那样创建一个 `values()` 方法，在类的 `Symbol.iterator` 方法中调用来现实链表的可迭代。而且，在双向链表中，您可以创建一个反向迭代器，该迭代器从尾部开始生成数据并朝着头部前进。下面是一个 `reverse()` 生成器方法的例子：

```js
class DoublyLinkedList {
  constructor() {
    this[head] = null
    this[tail] = null
  }

  * reverse() {
    // start by looking at the tail
    let current = this[tail]

    // follow the previous links to the head
    while (current !== null) {
      yield current.data
      current = current.previous
    }
  }

  [Symbol.iterator]() {
    return this.reverse()
  }
}
```
`reverse()` 发生器的方法遵循相同的算法， 与 `values()` 不同的是，单链表发生器方法的 current 开始等于 `this[tail]` 和 `current.previous` 之后，直到没有更多的节点。创建反向迭代器有助于发现实现中的错误以及避免重新排列节点只是为了以不同的顺序访问数据。

## 使用双向链表类

完成后，您可以像这样使用双向链表实现：

```js
const linked = new DoublyLinkedList()

linked.add(11)
linked.add(12)
linked.add(13)
linked.add(14)

const n = linked.get(2)
console.log(n)

console.log(linked.remove(2))

for (let v of linked) {
  console.log(v)
}
```

完整的源代码可以在 GitHub 上的我的 [Algorithm in JavaScript](https://github.com/alvinhtml/js-algorithm) 项目中找到。

## 结论

双链表类似于单链表，因为每个节点都有一个 next 指向列表中下一个节点的指针。每个节点还有一个 previous 指向列表中前一个节点的指针，使您可以轻松地在列表中前后移动。双向链表通常同时跟踪列表中的第一个和最后一个节点，这使得将节点添加到列表中成为 O(1) 操作，而不是单向链表中的 O(n)。

但是，其他双链表操作的复杂性与单链表相同，因为您最终总是遍历列表的大部分。因此，与 Array 等用于存储不相关数据集合的内置 JavaScript 类相比，双向链表并没有提供任何真正的优势，仅在少数表示相关数据的情况下，如浏览器中的同级 DOM 节点，可以用双链表的形式表示。

## Keywords

`JavaScript` `链表` `双向链表`

<!-- author alvin -->
<!-- email alvinhtml@gmail.com -->
<!-- createAt 2021-12-13 13:33:47 -->
<!-- updateAt 2021-12-13 13:33:47 -->

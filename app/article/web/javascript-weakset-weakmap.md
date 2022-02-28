# ES6 中的 WeakMap 和 WeakSet

WeakMap 和 WeakSet 是 ES6 新增的两个对象，根据 MDN 文档上的说法，它们的键必须是对象，并且键是弱引用的，会被浏览器垃圾回收机制回收。那么到底什么是弱引用，在什么情况下会被回收呢？要搞清这个问题，我们需要先简单的了解一下浏览器的垃圾回收机制。

## 浏览器垃圾回收机制

浏览器的垃圾回收机制是**标记删除**，它采用可达性 (reachability) 算法来判断堆中的对象应不应该被回收，这种算法的原理是从根节点（Root）出发，遍历所有的对象，可以遍历到的对象，称为**可达的**（reachable），会被标记，没有被遍历到的对象，是**不可达的**（unreachable），遍历完成后统一清理内存中所有不可达的对象。

为了提高标记删除的性能，浏览器还会配合**分代收集**、**增量收集**、**闲时收集** 等机制来提高性能，有兴趣的同学可以自行了解。

另外一种垃圾回收机制是**引用删除**，只在一些旧的浏览中被使用，它的机制是一个对象被一个变量引时，引用计数就会从 0 增加到 1，每被一个变量引用，这个计数会 + 1，释放一个引用它的变量，计数会 -1，当计数为 0 时，这个对象就会被清理。

## 强引用和弱引用

如果一个对象是强引用的，它就会被可达性算法遍历到，如果是弱引用，就不会被遍历到，自然就会被回收。WeakMap 的 key 就是弱引用的，如果这个 key 没有其它变量引用，这一项就会被回收。

让我们通过一个简单的例子来了解一下：

```js
const countMap = new Map();

let user = {
  name: "John",
};

countMap.set(user, 1);

user = null;

console.log(countMap); // {key: {name: 'John'}, value: 1}
```

我们先创建一个普通的 Map 集合 countMap，然后创建一个 user 变量，它的值是一个对象，然后用 user 作为 key，为 countMap 增加一个值为 1 的项。

接下我们将 user 的值设为 null，然后打印 countMap，这个时候会看到 countMap 的 size 是 1，里面有我们刚才设置的 `{key: {name: 'John'}, value: 1}` 这一项。这很好理解，虽然 `{name: 'John'}` 不在被 user 所引用，但它依然被 countMap 的 key 所引用，依然是可达的，所以它不会被从内存中回收，这种引用就是强引用。

## WeakMap

与 Map 不同的是，WeakMap 的 key 是弱引用，并且它的 key 只能是对象，不能是原始值，WeakMap 也没有 `keys()`、`values()`、`entries()` 等迭代方法。它只有以下的方法：

- weakMap.get(key)
- weakMap.set(key, value)
- weakMap.delete(key)
- weakMap.has(key)

我们把以上例子中的 Map 换成 WeakMap:

```js
const countMap = new WeakMap();

let user = {
  name: "John",
};

countMap.set(user, 1);

user = null;

console.log(countMap); // No properties
```

打印 countMap 你会发现是空的，我们刚才存进去的 key 为 user 的这一项已经不见了，因为已经被垃圾回收机制清除了，如果你注释掉 `user = null` 这一行，你就又能看到 `{key: {name: 'John'}, value: 1}` 。

当我们声明 `let user = {name: "John"}` 时，浏览器会在堆内存中创建一个对象 `{name: "John"}` (以下简称 John)，同时会在栈内存中创建一个变量 `user`，`user` 的值是一个指针，指向堆内存中的 John，当执行 `set(user, 1)` 时，会在 Map 中创建一个新的项，这一项的 key 是个引用类型，也指向 John。

当我们释放掉 `user` 这个变量后，对于普通 Map 对象，它的 key 还在引用 John，John 对于可达性算法来说是可达的，所以不会被回收，Map 中对应的这一项也就不会被回收，当换成 WeakMap 后，虽然 key 依然在引用着 John，但这个引用是弱引用，弱引用对可达性算法来说，是不可达的，也就是说可达性算法会无视弱引用，不会标记被弱引用的对象，于是 John 被回收，WeakMap 中对应的这一项也被回收。

总结来说，当一个对象作为 WeakMap 的 key 时，如果这个对象仅被 WeakMap 的 key 引用，没有被其它变量引用时，这个对象就会被回收。

## WeakSet

WeakSet 和 WeakMap 一样，区别是 WeakSet 只存值，没有 key，当 WeakSet 的值，没有其它变量引用时，这个值会被自动清理。

## WeakMap 的应用场景

一种应用场景是用来自动清理与一个对象相关的数据。比如有个用户对象 `{name: "John"}`, 我们要记录这个用户的鼠标点击次数。

```js
const countMap = new WeakMap();

let user = {
  name: "John",
};

// 递增用户鼠标点击次数
function click(user) {
  let count = countMap.get(user) || 0;
  countMap.set(user, count + 1);
}

click(user);
```

不久后，用户离开了：

```js
user = null;
```

countMap 中关于这个用户的记录就会自动被清理。

此外当我们使用一些第三方库，比如 echart 时，我们可以这样做：

```js
// 当我们需要在组件中展示一个图表时
const option = new WeakMap();

let myChart = echarts.init(chartDom);

option.set(myChart, {
  type: "pie",
  data: [],
});

myChart.setOption(option.get(myChart));

// 当离开组件时，在 unmounted 钩子中
myChart = null;
```

这样，整个和 myChart 相关的配置信息，都会被清理，避免了内存泄漏问题。

还有一种应用场景是可以用 WeakMap 来做缓存函数的结果，以便将来对同一个对象调用时可以重用这个结果，并且这个缓存会随着对象的释放而被清理。

```js
let cache = new WeakMap();

// 计算并缓存结果
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* 使用传进来的对象做一些计算 */ obj;

    cache.set(obj, result);
  }

  return cache.get(obj);
}

let obj = {
  // ...
};

let result1 = process(obj);

// 另一个地方调用时，会应用缓存中的结果
let result2 = process(obj);

// 稍后，我们不再需要这个对象时
obj = null;
```

当 obj 被垃圾回收，使用它做出的计算结果也没有存在的必要，WeakMap 使得这个缓存能被自动清理。

## 结束语

当我们只用对象作为 Map 的 key 时，最好的选择是用 WeakMap，它能够有效的避免内存泄露的问题，从而优化内存的使用。

## 参考

- 《深入理解 ES6》第七章
- [Javascript Garbage Collection](https://javascript.info/garbage-collection)

## Keywords

`WeakMap` `WeakSet` `垃圾回收` `标记清除` `弱引用`

<!-- author alvin -->
<!-- email alvinhtml@gmail.com -->
<!-- createAt 2022-02-25 12:28:00 -->
<!-- updateAt 2022-02-25 12:28:00 -->

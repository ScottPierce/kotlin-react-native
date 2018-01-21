package react

@JsModule("react")
external object React {
  abstract class Component<P, S>(
      props: P? = definedExternally,
      context: Any? = definedExternally
  ) {
    abstract fun render(): dynamic
  }

  fun createElement(elementClass: dynamic, props: dynamic, vararg children: dynamic): dynamic
}

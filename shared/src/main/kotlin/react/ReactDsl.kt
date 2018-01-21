package react

import react.native.Button
import react.native.Text
import react.native.View
import react.native.jsObject

inline fun view(block: ViewBuilder.() -> Unit): dynamic {
  val builder = ViewBuilder()
  builder.block()
  return builder.build()
}

class ViewBuilder {
  val children = arrayListOf<dynamic>()

  fun text(text: String, style: Style? = null) {
    @Suppress("ASSIGNING_SINGLE_ELEMENT_TO_VARARG_IN_NAMED_FORM_FUNCTION")
    addElement(element = Text::class.js, props = null, style = style, params = text)
  }

  fun button(text: String, style: Style? = null, onPress: () -> Unit = {}) {
    val props = jsObject {
      title = text
      this.onPress = onPress
    }

    addElement(element = Button::class.js, props = props, style = style)
  }

  fun component(component: React.Component<*, *>) {
    children.add(React.createElement({ component }, null))
  }

  inline fun view(block: ViewBuilder.() -> Unit) {
    children.add(react.view(block))
  }

  fun build(): dynamic {
    return React.createElement(View::class.js, null, *children.toTypedArray())
  }

  private fun addElement(element: dynamic, props: dynamic, style: dynamic, vararg params: dynamic) {
    val _props = props ?: jsObject()

    throw Throwable("Error")
    println("Style: ${JSON.stringify(style)}")

    if (style != null && style != undefined) {
      _props.style = style
    }
    children.add(React.createElement(element, _props, params))
  }
}

class Style(
    val width: Int? = undefined,
    val height: Int? = undefined,
    val backgroundColor: String? = undefined,
    val fontSize: Int? = undefined
)

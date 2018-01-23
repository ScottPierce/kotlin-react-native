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

  fun button(text: String, color: String? = undefined, onPress: () -> Unit = {}) {
    val props = jsObject {
      title = text
      this.color = color
      this.onPress = onPress
    }

    addElement(element = Button::class.js, props = props, style = null)
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

    // ############# Text Style Props #############
    /**
     * object: {width: number,height: number}
     */
    val textShadowOffset: Int? = undefined,
    val color: String? = undefined,
    val fontSize: Int? = undefined,
    /**
     * enum('normal', 'italic')
     */
    val fontStyle: String? = undefined,
    /**
     * Specifies font weight. The values 'normal' and 'bold' are supported for most fonts.
     * Not all fonts have a variant for each of the numeric values, in that case the closest one is
     * chosen.
     *
     * enum('normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900')
     */
    val fontWeight: String? = undefined,
    val lineHeight: Int? = undefined,
    /**
     * Specifies text alignment. The value 'justify' is only supported on iOS and fallbacks to left
     * on Android.
     *
     * enum('auto', 'left', 'right', 'center', 'justify')
     */
    val textAlign: String? = undefined,
    /**
     * enum('none', 'underline', 'line-through', 'underline line-through')
     */
    val textDecorationLine: String? = undefined,
    val textShadowColor: String? = undefined,
    val fontFamily: String? = undefined,
    val textShadowRadius: Int? = undefined,
    /**
     * Android only.
     *
     * Set to false to remove extra font padding intended to make space for certain ascenders /
     * descenders. With some fonts, this padding can make text look slightly misaligned when
     * centered vertically. For best results also set textAlignVertical to center. Default is true.
     */
    val includeFontPadding: Boolean? = undefined,
    /**
     * Android only.
     */
    val textAlignVertical: Int? = undefined,
    /**
     * iOS only.
     */
    val fontVariant: Int? = undefined,
    /**
     * iOS only.
     */
    val letterSpacing: Int? = undefined,
    /**
     * iOS only.
     */
    val textDecorationColor: String? = undefined,
    /**
     * iOS only.
     *
     * enum('solid', 'double', 'dotted', 'dashed')
     */
    val textDecorationStyle: Int? = undefined,
    /**
     * iOS only.
     *
     * enum('auto', 'ltr', 'rtl')
     */
    val writingDirection: String? = undefined
)

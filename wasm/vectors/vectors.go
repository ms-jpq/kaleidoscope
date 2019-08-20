package vectors

import (
	math2 "../math"
)

type Scalar = float32

type Vector interface {
	Slice() []Scalar
	Length() Scalar
	Normalized() Vector
	Plus(Scalar) Vector
	Minus(Scalar) Vector
	Times(Scalar) Vector
	DivideBy(Scalar) Vector
	PlusV(Vector) Vector
	MinusV(Vector) Vector
}

type Vec2 struct {
	X, Y Scalar
}
type Vec3 struct {
	X, Y, Z Scalar
}
type Vec4 struct {
	X, Y, Z, W Scalar
}

func (v Vec2) Slice() []Scalar {
	out := make([]Scalar, 2)
	out[0] = v.X
	out[1] = v.Y
	return out
}
func (v Vec3) Slice() []Scalar {
	out := make([]Scalar, 3)
	out[0] = v.X
	out[1] = v.Y
	out[2] = v.Z
	return out
}
func (v Vec4) Slice() []Scalar {
	out := make([]Scalar, 4)
	out[0] = v.X
	out[1] = v.Y
	out[2] = v.Z
	out[3] = v.W
	return out
}

func (v Vec2) Length() Scalar {
	return math2.SqrtF32(math2.Pow32(v.X, 2) + math2.Pow32(v.Y, 2))
}
func (v Vec3) Length() Scalar {
	return math2.SqrtF32(math2.Pow32(v.X, 2) + math2.Pow32(v.Y, 2) + math2.Pow32(v.Z, 2))
}
func (v Vec4) Length() Scalar {
	return math2.SqrtF32(math2.Pow32(v.X, 2) + math2.Pow32(v.Y, 2) + +math2.Pow32(v.Z, 2) + +math2.Pow32(v.W, 2))
}

func (v Vec2) Normalized() Vec2 {
	return v.DivideBy(v.Length())
}
func (v Vec3) Normalized() Vec3 {
	return v.DivideBy(v.Length())
}
func (v Vec4) Normalized() Vec4 {
	return v.DivideBy(v.Length())
}

func (v Vec2) Plus(n Scalar) Vec2 {
	return Vec2{v.X + n, v.Y + n}
}
func (v Vec3) Plus(n Scalar) Vec3 {
	return Vec3{v.X + n, v.Y + n, v.Z + n}
}
func (v Vec4) Plus(n Scalar) Vec4 {
	return Vec4{v.X + n, v.Y + n, v.Z + n, v.W + n}
}

func (v Vec2) Times(n Scalar) Vec2 {
	return Vec2{v.X * n, v.Y * n}
}
func (v Vec3) Times(n Scalar) Vec3 {
	return Vec3{v.X * n, v.Y * n, v.Z * n}
}
func (v Vec4) Times(n Scalar) Vec4 {
	return Vec4{v.X * n, v.Y * n, v.Z * n, v.W * n}
}

func (v Vec2) PlusV(v2 Vec2) Vec2 {
	return Vec2{v.X + v2.X, v.Y + v2.Y}
}
func (v Vec3) PlusV(v2 Vec3) Vec3 {
	return Vec3{v.X + v2.X, v.Y + v2.Y, v.Z + v2.Z}
}
func (v Vec4) PlusV(v2 Vec4) Vec4 {
	return Vec4{v.X + v2.X, v.Y + v2.Y, v.Z + v2.Z, v.W + v2.W}
}

func (v Vec2) Minus(n Scalar) Vec2 {
	return v.Plus(n * -1)
}
func (v Vec3) Minus(n Scalar) Vec3 {
	return v.Plus(n * -1)
}
func (v Vec4) Minus(n Scalar) Vec4 {
	return v.Plus(n * -1)
}

func (v Vec2) DivideBy(n Scalar) Vec2 {
	return v.Times(1 / n)
}
func (v Vec3) DivideBy(n Scalar) Vec3 {
	return v.Times(1 / n)
}
func (v Vec4) DivideBy(n Scalar) Vec4 {
	return v.Times(1 / n)
}

func (v Vec2) MinusV(v2 Vec2) Vec2 {
	return v.PlusV(v2.Times(-1))
}
func (v Vec3) MinusV(v2 Vec3) Vec3 {
	return v.PlusV(v2.Times(-1))
}
func (v Vec4) MinusV(v2 Vec4) Vec4 {
	return v.PlusV(v2.Times(-1))
}

func (v Vec2) Rotated(θ Scalar) Vec2 {
	return Vec2{
		X: v.X*math2.Cos32(θ) - v.Y*math2.Sin32(θ),
		Y: v.X*math2.Sin32(θ) + v.Y*math2.Cos32(θ),
	}
}

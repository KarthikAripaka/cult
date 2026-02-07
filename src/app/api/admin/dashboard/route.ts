import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// GET dashboard stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const period = searchParams.get('period') || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    if (type === 'overview') {
      // Get overview statistics
      
      // Total users
      const { count: totalUsers } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Total products
      const { count: totalProducts } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Total orders
      const { count: totalOrders } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Revenue (paid orders)
      const { data: revenueData } = await supabaseAdmin
        .from('orders')
        .select('total')
        .eq('payment_status', 'paid');

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total, 0) || 0;

      // Orders by status
      const { data: ordersByStatusRaw } = await supabaseAdmin
        .from('orders')
        .select('status');

      // Group by status manually
      const ordersByStatus: Record<string, number> = {};
      ordersByStatusRaw?.forEach(order => {
        ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
      });

      const ordersByStatusFormatted = Object.entries(ordersByStatus).map(([status, count]) => ({
        status,
        count,
      }));

      // Recent orders
      const { data: recentOrders } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Top selling products
      const { data: topProductsData } = await supabaseAdmin
        .from('orders')
        .select('items')
        .gte('created_at', startDate.toISOString());

      // Calculate product sales
      const productSales: Record<string, { quantity: number; name: string; images: string[] }> = {};
      topProductsData?.forEach(order => {
        order.items?.forEach((item: any) => {
          if (!productSales[item.id]) {
            productSales[item.id] = { quantity: 0, name: item.name, images: item.image ? [item.image] : [] };
          }
          productSales[item.id].quantity += item.quantity;
        });
      });

      const topProductEntries = Object.entries(productSales)
        .sort(([, a], [, b]) => b.quantity - a.quantity)
        .slice(0, 5);

      const topSellingProducts = topProductEntries.map(([id, data]) => ({
        id,
        name: data.name,
        images: data.images,
        quantity: data.quantity,
      }));

      return NextResponse.json({
        overview: {
          totalUsers: totalUsers || 0,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue,
        },
        ordersByStatus: ordersByStatusFormatted,
        recentOrders: recentOrders || [],
        topSellingProducts,
      });
    }

    if (type === 'sales') {
      // Sales analytics
      const { data: dailySales } = await supabaseAdmin
        .from('orders')
        .select(`
          created_at,
          total,
          payment_status
        `)
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: true });

      // Group by date
      const salesByDate: Record<string, { orders: number; revenue: number }> = {};
      dailySales?.forEach(order => {
        const date = order.created_at.split('T')[0];
        if (!salesByDate[date]) {
          salesByDate[date] = { orders: 0, revenue: 0 };
        }
        salesByDate[date].orders += 1;
        salesByDate[date].revenue += order.total;
      });

      const chartData = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        ...data,
      }));

      return NextResponse.json({
        chartData,
        period: `${period} days`,
        totalRevenue: chartData.reduce((sum, d) => sum + d.revenue, 0),
        totalOrders: chartData.reduce((sum, d) => sum + d.orders, 0),
      });
    }

    if (type === 'users') {
      // Users analytics
      const { data: newUsers } = await supabaseAdmin
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Group by date
      const usersByDate: Record<string, number> = {};
      newUsers?.forEach(user => {
        const date = user.created_at.split('T')[0];
        usersByDate[date] = (usersByDate[date] || 0) + 1;
      });

      const chartData = Object.entries(usersByDate).map(([date, count]) => ({
        date,
        count,
      }));

      return NextResponse.json({
        chartData,
        period: `${period} days`,
        totalNewUsers: chartData.reduce((sum, d) => sum + d.count, 0),
      });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

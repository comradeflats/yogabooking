"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit2, Palette } from "lucide-react";

interface ClassType {
  id: number;
  name: string;
  description: string | null;
  color: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ClassTypesPage() {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#10b981",
    duration_minutes: 60,
  });

  useEffect(() => {
    fetchClassTypes();
  }, []);

  const fetchClassTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/booking-portal/class-types");
      const data = await response.json();
      setClassTypes(data);
    } catch (error) {
      console.error("Error fetching class types:", error);
      toast.error("Failed to fetch class types");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/booking-portal/class-types/${editingId}`
        : "/api/booking-portal/class-types";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save class type");
      }

      toast.success(editingId ? "Class type updated" : "Class type created");
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        color: "#10b981",
        duration_minutes: 60,
      });
      fetchClassTypes();
    } catch (error) {
      console.error("Error saving class type:", error);
      toast.error("Failed to save class type");
    }
  };

  const handleEdit = (classType: ClassType) => {
    setEditingId(classType.id);
    setFormData({
      name: classType.name,
      description: classType.description || "",
      color: classType.color,
      duration_minutes: classType.duration_minutes,
    });
    setShowForm(true);
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/booking-portal/class-types/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("Class type status updated");
      fetchClassTypes();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Class Types</h1>
          <p className="text-muted-foreground">
            Manage yoga class categories and styles
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancel" : "Add Class Type"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Class Type" : "Create New Class Type"}
            </CardTitle>
            <CardDescription>
              Define a new yoga class category with color and duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Vinyasa Flow"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration_minutes: parseInt(e.target.value, 10),
                      })
                    }
                    min={15}
                    max={180}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this class type..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-3 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#10b981"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="font-mono"
                  />
                  <div
                    className="w-20 h-10 rounded border"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      color: "#10b981",
                      duration_minutes: 60,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Update" : "Create"} Class Type
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Class Types ({classTypes.length})</CardTitle>
          <CardDescription>
            Configure class categories, colors, and default durations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading class types...
            </div>
          ) : classTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No class types found. Create your first class type to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {classTypes.map((classType) => (
                <div
                  key={classType.id}
                  className="border rounded-lg p-4 space-y-3"
                  style={{
                    borderLeftWidth: "4px",
                    borderLeftColor: classType.color,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {classType.name}
                        </h3>
                        <Badge
                          variant={classType.is_active ? "default" : "secondary"}
                        >
                          {classType.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      {classType.description && (
                        <p className="text-sm text-muted-foreground">
                          {classType.description}
                        </p>
                      )}

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">{classType.color}</span>
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: classType.color }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">
                            {classType.duration_minutes} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(classType)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={classType.is_active ? "outline" : "default"}
                        size="sm"
                        onClick={() =>
                          toggleActive(classType.id, classType.is_active)
                        }
                      >
                        {classType.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
